package com.myplatform.common.utils;

import java.util.Date;
import java.util.UUID;

/**
 * 创建日期:2016年10月21日 上午10:56:23
 * Description: 
 * @author chaoxu-yao
 * @mender：（修改者，创建者之外的人）
 * @version 1.0
 * Remark：（备注信息）
 */
public class CommonUtil {

	/**
	 * 功能: 生成32位id
	 * 作者: chaoxu-yao
	 * 创建日期:2016年10月21日 上午10:57:23
	 * @return
	 */
	public static String generateId() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}
	
	/**
	 * 功能: 获取系统时间
	 * 作者: chaoxu-yao
	 * 创建日期:2016年10月24日 上午9:54:09
	 * @return
	 */
	public static Date systemTime() {
		return new Date();
	}
	
	/**
	 * 功能: 登录人id
	 * 作者: chaoxu-yao
	 * 创建日期:2016年10月24日 上午10:46:04
	 * @return
	 */
	public static String loginUser() {
		return "";
	}
}
