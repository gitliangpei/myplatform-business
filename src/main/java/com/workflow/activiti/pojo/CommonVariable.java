package com.workflow.activiti.pojo;

/**
 * 创建日期:2016-4-1
 * Title:通用变量对象
 */
public class CommonVariable {

	//变量名
	private String name;
	//变量类型
	private String type;
	//变量值
	private String value;
	
	//版本号
	private int rev;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public int getRev() {
		return rev;
	}

	public void setRev(int rev) {
		this.rev = rev;
	}
	
	
	
	
}
