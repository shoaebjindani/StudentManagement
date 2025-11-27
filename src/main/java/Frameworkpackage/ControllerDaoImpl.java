package Frameworkpackage;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

public class ControllerDaoImpl  extends CommonFunctions
{

	public void makeAuditTrailEntryDB(HashMap<String, Object> itemDetails,Connection con) throws ClassNotFoundException, SQLException
	{	
		ArrayList<Object> parameters=new ArrayList<>();
		String username=itemDetails.get("sessionUsername")==null?"":itemDetails.get("sessionUsername").toString();
		parameters.add(username);
		parameters.add(itemDetails.get("completeURL"));
		parameters.add(itemDetails.get("Parameters"));
		parameters.add(itemDetails.get("reqStartTime"));
		parameters.add(itemDetails.get("ipAddress"));
		parameters.add(itemDetails.get("browserInfo"));
		parameters.add(itemDetails.get("responseJson"));		
		String insertQuery= "insert into frm_audit_trail" + " VALUES " + "(default,?,?,?,?,?,?,sysdate(),?)";
		insertUpdateWithLogging(insertQuery, parameters, con,"OFF");
	}
	
	
	public HashMap<String,String> getUserDetailsByUserId(String userId,Connection con) throws SQLException, ClassNotFoundException
	{
		ArrayList<Object> parameters=new ArrayList<>();
		parameters.add(userId);		
		return getMap(parameters, "SELECT * FROM tbl_user_mst user where user_id=?", con);
	}
	
	
}
