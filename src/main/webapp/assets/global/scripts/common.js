//访问后台路径
var authPath = 'http://127.0.0.1:8000/myplatform-security';
//表格页数
var pageSize = 10;
//系统id
var applicationId = '6daa66af40074220b2a962366c383e68';

//注销用户
function ssoLogout() { 
	var msgSSOLogout = '确定要退出系统吗？'; 
	
    if(confirm(msgSSOLogout)) {
        $('#btnSubmitLogout').click();
    } 
}

//读取上下文路径
function getContextName(){  
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp  
    var pathName=window.document.location.pathname;  
    //获取带"/"的项目名，如：/uimcardprj  
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);  
    return projectName;  
}  