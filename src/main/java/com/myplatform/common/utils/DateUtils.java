package com.myplatform.common.utils;

import java.util.Date;



/**
 * 
 * 创建日期:2016年9月12日
 * Title:文件所属模块（必须填写）
 * Description：对本文件的详细描述，原则上不能少于30字
 * @author lp
 * @mender：（文件的修改者，文件创建者之外的人）
 * @version 1.0
 * Remark：认为有必要的其他信息
 */
public class DateUtils {
	
	public static String getYmdStr(Date date) {
		if (date == null)
			return "";
		else
			return new java.text.SimpleDateFormat("yyyy-MM-dd").format(date);
	}
	
	public static String getYmdStr(Date date, String pattern) {
		if (date == null)
			return "";
		else
			return new java.text.SimpleDateFormat(pattern).format(date);
	}

}
