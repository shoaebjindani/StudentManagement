package com.shoaeb.shoaeb.Configuration;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import Frameworkpackage.CommonFunctions;
import Frameworkpackage.CommonServiceImpl;



@WebListener
public class Config implements ServletContextListener {
	

    public void contextInitialized(ServletContextEvent event) {
    	
    	
    	
    	CommonFunctions cf=new CommonFunctions();;
    	try {
			cf.initializeApplication(new Class[] {Config.class,CommonServiceImpl.class},event.getServletContext());
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    }

    public void contextDestroyed(ServletContextEvent event) {
        // Do stuff during webapp's shutdown.
    }

}