package Frameworkpackage;

import java.io.Serializable;

import java.util.List;



public class Element implements Serializable
{
		private Long elementId;
		public long getElementId() {
			return elementId;
		}
		public void setElementId(Long elementId) {
			this.elementId = elementId;
		}
		public String getElementName() {
			return elementName;
		}
		public void setElementName(String elementName) {
			this.elementName = elementName;
		}
		public long getParentElementId() {
			return parentElementId;
		}
		public void setParentElementId(long parentElementId) {
			this.parentElementId = parentElementId;
		}
		public String getElementUrl() {
			return elementUrl;
		}
		public void setElementUrl(String elementUrl) {
			this.elementUrl = elementUrl;
		}		
		
		public int getOrderNo() {
			return orderNo;
		}
		public void setOrderNo(int orderNo) {
			this.orderNo = orderNo;
		}
		private String elementName;
		private long parentElementId;
		private String elementUrl;
		
		private int orderNo;
		
		/*
		 * public Element(Long elementId, String elementName, Long parentElementId,
		 * String elementUrl, Integer orderNo, List<Element> childElements) { super();
		 * this.elementId = elementId; this.elementName = elementName;
		 * this.parentElementId = parentElementId; this.elementUrl = elementUrl;
		 * 
		 * this.orderNo = orderNo; this.childElements = childElements; }
		 */
		public Element(int elementId, String elementName, int parentElementId, String elementUrl,
				Integer orderNo, List<Element> childElements) {
			super();
			this.elementId = Long.valueOf(String.valueOf(elementId));
			this.elementName = elementName;
			this.parentElementId = parentElementId;
			this.elementUrl = elementUrl;
			
			this.orderNo = orderNo;
			this.childElements = childElements;
		}
		public Element() {
		}
	
		private List<Element> childElements;
		public List<Element> getChildElements() {
			return childElements;
		}
		public void setChildElements(List<Element> childElements) {
			this.childElements = childElements;
		}
		
		public String toString()
		{
			return this.elementId+"~"+this.elementName;			
		}
		@Override
		public int hashCode() {
			// TODO Auto-generated method stub
			return super.hashCode();
		}
		@Override
		public boolean equals(Object obj) {
			// TODO Auto-generated method stub
			return this.elementId==((Element)obj).getElementId();
			
		}
		
		
}


 