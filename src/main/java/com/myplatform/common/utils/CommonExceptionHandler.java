package com.myplatform.common.utils;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

public class CommonExceptionHandler implements HandlerExceptionResolver {

	@ResponseBody
	public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler,
			Exception ex) {
		response.setStatus(500);
		try { 
            PrintWriter writer = response.getWriter();  
            writer.write(ex.getMessage());  
            writer.flush();  
        } catch (IOException e) {  
            e.printStackTrace();  
        }
		ModelAndView mav = new ModelAndView();
		return mav;
	}
}
