package Frameworkpackage;

import java.util.HashMap;

public class CustomResultObject 
{
	public CustomResultObject(){}
	
	String ajaxData;
	String viewName;
	String messageBeforeNavigation;
	HashMap<String, Object> returnObject; 
	boolean hasError;
	public boolean disablemodaljsp;
	
	

	
	
	
	public boolean isHasError() {
		return hasError;
	}
	public void setHasError(boolean hasError) {
		this.hasError = hasError;
	}
	public HashMap<String, Object> getReturnObject() {
		return returnObject;
	}
	public void setReturnObject(HashMap<String, Object> returnObject) {
		this.returnObject = returnObject;
	}
	public String getAjaxData() {
		return ajaxData;
	}
	public void setAjaxData(String ajaxData) {
		this.ajaxData = ajaxData;
	}
	public String getViewName() {
		return viewName;
	}
	public void setViewName(String viewName) {
		this.viewName = viewName;
	}
	public String getMessageBeforeNavigation() {
		return messageBeforeNavigation;
	}
	public void setMessageBeforeNavigation(String messageBeforeNavigation) {
		this.messageBeforeNavigation = messageBeforeNavigation;
	}

	
	
	
	
	
}
