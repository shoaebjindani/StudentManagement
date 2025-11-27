package Frameworkpackage;

public class FrmActionService 
{		
	private String actionName;
	private String className;
	private boolean authorizationByPass;
	public String getActionName() {
		return actionName;
	}
	public void setActionName(String actionName) {
		this.actionName = actionName;
	}
	public String getClassName() {
		return className;
	}
	public void setClassName(String className) {
		this.className = className;
	}
	public boolean isAuthorizationByPass() {
		return authorizationByPass;
	}
	public void setAuthorizationByPass(boolean authorizationByPass) {
		this.authorizationByPass = authorizationByPass;
	}
	public FrmActionService(String actionName, String className, boolean authorizationByPass) {
		super();
		this.actionName = actionName;
		this.className = className;
		this.authorizationByPass = authorizationByPass;
	}
	
	
	
	
	
	
	
}
