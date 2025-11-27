package Frameworkpackage;

public class Action 
{
		private String actionName;
	
		private  String fullClassPath;
		private  boolean isBypassed;
		
		public String getActionName() {
			return actionName;
		}
		public void setActionName(String actionName) {
			this.actionName = actionName;
		}
		public String getFullClassPath() {
			return fullClassPath;
		}
		public void setFullClassPath(String fullClassPath) {
			this.fullClassPath = fullClassPath;
		}
		public boolean isBypassed() {
			return isBypassed;
		}
		public void setBypassed(boolean isBypassed) {
			this.isBypassed = isBypassed;
		}
		public Action(String actionName, String fullClassPath, boolean isBypassed) {
			super();
			this.actionName = actionName;
			this.fullClassPath = fullClassPath;
			this.isBypassed = isBypassed;
		}
		

}
