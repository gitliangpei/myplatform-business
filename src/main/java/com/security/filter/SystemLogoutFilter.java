/**
 * Copyright(c)2008 Beijing ieforever Co. Ltd.
 * All right reserved.
 * 项目名称:工程管理项目
 * 创建日期:2016年11月18日
 */

package com.security.filter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.session.SessionException;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.LogoutFilter;
import org.springframework.stereotype.Service;

/**
 * 创建日期:2016年11月18日
 * Title:文件所属模块（必须填写）
 * Description：对本文件的详细描述，原则上不能少于30字
 * @author lp
 * @mender：（文件的修改者，文件创建者之外的人）
 * @version 1.0
 * Remark：认为有必要的其他信息
 */
@Service
public class SystemLogoutFilter  extends LogoutFilter{

	@Override
    protected boolean preHandle(ServletRequest request, ServletResponse response) throws Exception {
        //在这里执行退出系统前需要清空的数据
		Subject subject = getSubject(request, response);

        String redirectUrl = getRedirectUrl(request, response, subject);

        try {

            subject.logout();

        } catch (SessionException ise) {

           ise.printStackTrace();

        }

        issueRedirect(request, response, redirectUrl);

        //返回false表示不执行后续的过滤器，直接返回跳转到登录页
        return false;

    }
}
