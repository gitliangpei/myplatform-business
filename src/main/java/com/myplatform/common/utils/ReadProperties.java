package com.myplatform.common.utils;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;

/**
 * 创建日期:2015-1-16
 * Title:读取properties文件
 */
public class ReadProperties {
	
	/**
	 * 默认根目录
	 */
	private final static String root = "";
	/**
	 * 默认参数文件名
	 */
	private final static String defaultFile = "param-messages.properties";
	
	/**
	 * 
	 * 功能:通过key获取参数值
	 * 创建日期:2015-1-16 
	 * @param key
	 * @return
	 */
	public static String getKey(String key){
		
		return getKey(root + "/" + defaultFile, key);
	}
	
	/**
	 * 
	 * 功能:通过问津名称和key获取参数值
	 * 创建日期:2015-1-16 
	 * @param fileName(带路径)
	 * @param key
	 * @return
	 */
	public static String getKey(String fileName, String key){
		String result = "";
		PropertiesConfiguration config;
		try {
			config = new PropertiesConfiguration(fileName);
			result = config.getString(key);
		} catch (ConfigurationException e) {
			e.printStackTrace();
		}
		
		return result;
	}

}
