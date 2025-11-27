package com.shoaeb.basecontroller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import Frameworkpackage.ControllerServiceImpl;

@WebServlet(name = "BaseController" , urlPatterns = {""})
public class BaseController extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public BaseController() {
		super();

	}



	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		serverReq(request, response);

	}

	
	
	
	



	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		serverReq(request, response);
	}

	ControllerServiceImpl cf = new ControllerServiceImpl();

	public void serverReq(HttpServletRequest request, HttpServletResponse response) {
		try {
			
			cf.serveRequest(request, response);
		} catch (Exception e) {

			cf.writeErrorToDB(e);
		}
	}

}
