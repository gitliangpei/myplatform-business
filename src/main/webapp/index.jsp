<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Insert title here</title>
<script type="text/javascript" src="./vendor/jquery-1.12.4/jquery.min.js"></script>
</head>
<body>

</body>
<script type="text/javascript">
$.get("./rest/security/loginAuth?r="+Math.random());
location.href = "app/index.html";
</script>
</html>