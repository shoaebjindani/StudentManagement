package Frameworkpackage;

import java.io.IOException;

import java.sql.SQLException;



public class DumpCollection {

	public static void main(String[] args) throws ClassNotFoundException, SQLException, IOException {
		CommonFunctions cf=new CommonFunctions();
    	cf.initializeApplication();
		cf.doDump();
	}
	

}
