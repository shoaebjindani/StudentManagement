package Frameworkpackage;



import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;









public class ControllerServiceImpl extends CommonFunctions {

	
	private static final int MegaBytes = 1024 * 1024;

	public void serveRequest(HttpServletRequest request, HttpServletResponse response)
			 {
	response.addHeader("Access-Control-Allow-Origin", "*");
		Connection con = null;
		response.addHeader("Access-Control-Allow-Origin", "*");
		HashMap<String, Object> mapFromRequest = null;
		String reqStartTime = null;
		try {
			Date startDatetime = new Date();
			String action = request.getParameter("a") == null ? request.getParameter("actionName")
					: request.getParameter("a");
			action = action == null ? "showHomePage" : action;
			if(action.contains("?"))
			{
				action = action.split("\\?")[0];
			}
			String logMessage="Action Flag receieved is " + action;
			con = getConnectionJDBC();
			con.setAutoCommit(false);

			//logger.debug("Connection Opened Succesfully");
			reqStartTime = getDateTime(con);
			//logger.debug("Datetime From DB Received as" + reqStartTime);

			
			//System.out.println(actions);			
			boolean isBypassed =  lstbypassedActions.contains(action);
			
			logMessage+=" and action "+"is ByPassed value :-" + isBypassed;
			if ((action == null || action.equals("")) && request.getSession().getAttribute(username_constant) != null) {
				
				logMessage+=" Will Redirect Back to Homepage";
				response.sendRedirect("?a=showHomePage"); // No logged-in user found, so redirect to login page.
				response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
				response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
				response.setDateHeader("Expires", 0);
				mapFromRequest = getMapfromRequest(request, reqStartTime, webPortal, con);
				logger.debug(logMessage);
				return;
			}
			request.getSession().setAttribute("projectName",CommonFunctions.projectName);
			// send to login if session is null and the action is also not bypassed
			if (!isBypassed && request.getSession().getAttribute(username_constant) == null) {
				logMessage+="Session Found as Null and the action is also not bypassed";
				String app_code="";
				if(request.getSession().getAttribute("logoutappshortcode")!=null)
				{
					app_code=(String) request.getSession().getAttribute("logoutappshortcode");
				}
				else
				{
					app_code=request.getParameter("app_code");
				}

				response.sendRedirect("frameworkjsps/Login.jsp?app_code="+app_code); // No logged-in user found, so redirect to login page.
				response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
				response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
				mapFromRequest = getMapfromRequest(request, reqStartTime, webPortal, con);
				
				return;
			}

			// if the action is not bypassed then check if this action is mapped to list of
			// actions available for this role
			//HashSet<String> allowedActionsForThisRole = (HashSet<String>) request.getSession().getAttribute("actions");
			String userId="0";
			HashSet<String> allowedActionsForThisRole=null;
			HashSet<Integer> allowedReportsForThisRole=null;
			
			if(request.getSession().getAttribute("userdetails")!=null)
			{
				userId = ((HashMap<String, String>) request.getSession().getAttribute("userdetails")).get("user_id");			
				 allowedActionsForThisRole= getActionsForthisUserDecoupled(Long.valueOf(userId), con,CommonFunctions.roles);			
				 
			}
			//logger.info("List of Allowed Actions for this role" + allowedActionsForThisRole);
			if (allowedActionsForThisRole == null) {
				allowedActionsForThisRole = new HashSet<String>();
			}
			if (isBypassed && action != null) {
				allowedActionsForThisRole.add(action);
			}

			if (action != null && !allowedActionsForThisRole.contains(action) ) {
				logMessage+="Redirecting to Unauthorized Page as Action is "+action ;				
				RequestDispatcher dispatcher = request.getRequestDispatcher("frameworkjsps/unAuthorized.jsp");
				dispatcher.forward(request, response);
				mapFromRequest = getMapfromRequest(request, reqStartTime, webPortal, con);				
				logger.debug(logMessage);
				return;
			}

			String reportId=request.getParameter("report_id");
			if (action != null && action.equals("showReport") && !lstbypassedReports.contains(reportId) && !allowedReportsForThisRole.contains(Integer.valueOf(reportId))) {
				logger.debug("Redirecting to Unauthorized Page as Report is "+reportId + "Allowed Reports for this role is "+allowedReportsForThisRole);				
				RequestDispatcher dispatcher = request.getRequestDispatcher("frameworkjsps/unAuthorized.jsp");
				dispatcher.forward(request, response);
				mapFromRequest = getMapfromRequest(request, reqStartTime, webPortal, con);				
				return;
			}
			// code for authorization ends

			//HashMap<String, String> classandmethodInfo = getClassNameAndMethodNameUsingJDBC(action, con);			
			mapFromRequest = getMapfromRequest(request, reqStartTime, webPortal, con);
			FrmActionService frmAction= (FrmActionService)actions.get(action);
			
			// added so that threads donot over lap with each other
			if(request.getSession().getAttribute("userdetails")!=null)
			{
				logMessage+="session is not null";
				HashMap<String, String> hm= (HashMap<String, String>) request.getSession().getAttribute("userdetails");
				logMessage+="getting userdetails"+hm;
				Integer threads_overlap=0;
				if(hm.get("threads_overlap")!=null)
				{
					threads_overlap=Integer.parseInt(hm.get("threads_overlap").toString());
				}
				
				if(CommonFunctions.threadSleep>threads_overlap)
				{
					Thread.sleep(CommonFunctions.threadSleep * 1000);
				}
				else
				{
					Thread.sleep(threads_overlap* 1000);
				}
			}
			
			Class<?>[] paramString = new Class[2];
			paramString[0] = HttpServletRequest.class;
			paramString[1] = Connection.class;
			Class<?> cls = Class.forName(frmAction.getClassName());
			Object obj = cls.newInstance();
			//Thread.sleep(4000);
			Method method = cls.getDeclaredMethod(frmAction.getActionName(), paramString);
			CustomResultObject rs = null;
			
			
			rs = (CustomResultObject) method.invoke(obj, request, con);

			if (rs.getViewName() != null) {
				
				
				List<String> roleIds =getRoleIds(Long.valueOf(userId), con);

				
				logMessage+="Found a view Name so redirecting to " + rs.getViewName();
				HashMap<String, Object> hm = rs.getReturnObject();
				hm.put("contentJspName", rs.getViewName());
				hm.put(username_constant, request.getSession().getAttribute(username_constant));
				hm.put("elementsDB",getElementsNewLogic(roleIds,CommonFunctions.elements,CommonFunctions.roles));
				
				
				
				request.setAttribute("outputObject", hm);
				if (isBypassed) {
					RequestDispatcher dispatcher = request.getRequestDispatcher("frameworkjsps/model.jsp");
					dispatcher.forward(request, response);
				} else if(rs.disablemodaljsp)
				{
					RequestDispatcher dispatcher = request.getRequestDispatcher(rs.getViewName());
					HttpSession session = request.getSession();
Cookie sessionCookie = new Cookie("JSESSIONID", session.getId());
sessionCookie.setMaxAge(60*60*24); // 1 day
response.addCookie(sessionCookie);
					dispatcher.forward(request, response);
				}
				else
				{
					RequestDispatcher dispatcher = request.getRequestDispatcher("frameworkjsps/model.jsp");
					HttpSession session = request.getSession();
Cookie sessionCookie = new Cookie("JSESSIONID", session.getId());
sessionCookie.setMaxAge(60*60*24); // 1 day
response.addCookie(sessionCookie);
					dispatcher.forward(request, response);
				}


			} else if (rs.getAjaxData() != null) // its ajax data
			{
				//logger.info("Ajax Call so returning Ajax content:- " + rs.getAjaxData());
				response.setContentType("text/html; charset=UTF-8");
				response.setHeader("Access-Control-Allow-Origin", "*");
				response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS");
				response.setHeader("Access-Control-Allow-Headers", "*");			      
				response.setCharacterEncoding("UTF-8");
				response.getWriter().write(rs.getAjaxData());

			} else // its a file
			{
				logMessage+="Its not ajax nor a view name, Unless its a file download something is wrong";
				String filepath = rs.getReturnObject().get(filename_constant).toString();
				logMessage+="Found a File So returning " + "BufferedImagesFolder/" + filepath;
				response.sendRedirect("BufferedImagesFolder/" + filepath);
			}

			
			
			con.commit();
			
			Date EndTime = new Date();
			logMessage+="Request End Time " + EndTime;
			logMessage+="\nTime Taken For Request -- " + (EndTime.getTime() - startDatetime.getTime());

			

			logger.debug(logMessage);

		} catch (Exception e) {
			
			try {
			logger.error(e);
			e.printStackTrace();
			con.rollback();			
			mapFromRequest = getMapfromRequest(request, reqStartTime, webPortal, con);
			
			RequestDispatcher dispatcher = request.getRequestDispatcher("frameworkjsps/errorPage.jsp");
			dispatcher.forward(request, response);
			}
			catch(Exception m) {m.printStackTrace();}
		}
		finally
		{
			try 
			{
			con.close();
			makeAuditTrailEntry(mapFromRequest, reqStartTime, webPortal);
			}
			catch(Exception m)
			{
				m.printStackTrace();
			}
			
		}
	}
	
	
	

	public void makeAuditTrailEntryDelayed(final HashMap<String, Object> hmFromRequest, final String reqStartTime,
			final String responseJson) throws SQLException, ClassNotFoundException {

		if (!CommonFunctions.isAuditEnabled) {
			return;
		}

		new Thread(new Runnable() {
			public void run() {
				try {
					makeAuditTrailEntry(hmFromRequest, reqStartTime, responseJson);
				} catch (ClassNotFoundException e) {

				} catch (SQLException e) {
					// TODO Auto-generated catch block
				}
			}
		}).start();

	}
	
	

	public HashMap<String, Object> getMapfromRequest(HttpServletRequest request, String reqStartTime,
			String responseJson, Connection con) throws ClassNotFoundException, SQLException {

		StringBuffer requestURL = request.getRequestURL();
		if (request.getQueryString() != null) {
			requestURL.append("?").append(request.getQueryString());
		}
		String completeURL = requestURL.toString();
		String Parameters = "";
		String username = "";
		
		
		for (Map.Entry<String, String[]> entry :
			 ((Map<String, String[]>)request.getParameterMap()).entrySet()) {
			String name = entry.getKey();
			String value = entry.getValue()[0];
			Parameters += "\n" + name + " " + value;
			if (name.equals("user_id")) {
				username = dao.getUserDetailsByUserId(value, con).get("username");
			}
			 }
		
		
		
		String ipAddress = request.getHeader("X-FORWARDED-FOR") == null ? request.getRemoteAddr()
				: request.getHeader("X-FORWARDED-FOR");
		String session_username = request.getSession().getAttribute(username_constant) == null ? ""
				: request.getSession().getAttribute(username_constant).toString();
		String browserInfo = request.getHeader("User-Agent");
		HashMap<String, Object> hmDetails = new HashMap<>();

		hmDetails.put("sessionUsername", session_username);

		if (session_username.equals("")) {
			hmDetails.put("sessionUsername", username);
		}

		hmDetails.put("completeURL", completeURL);
		hmDetails.put("Parameters", Parameters);
		hmDetails.put("reqStartTime", reqStartTime);
		hmDetails.put("ipAddress", ipAddress);
		hmDetails.put("browserInfo", browserInfo);
		hmDetails.put("responseJson", responseJson);
		return hmDetails;

	}

	public void makeAuditTrailEntry(HashMap<String, Object> hmDetails, String reqStartTime, String responseJson)
			throws SQLException, ClassNotFoundException {
		try 
		{
		if (!CommonFunctions.isAuditEnabled) {
			return;
		}

		Connection con = getConnectionJDBC();
		dao.makeAuditTrailEntryDB(hmDetails, con);
		con.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}

	ControllerDaoImpl dao = new ControllerDaoImpl();
}
