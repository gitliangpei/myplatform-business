package com.myplatform.query.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myplatform.query.dto.EZQueryDto;
import com.myplatform.query.dto.SearchCondition;


/**
 * 
 * 创建日期:2016年9月18日
 * Title:分页查询service基类
 * Description：对本文件的详细描述，原则上不能少于30字
 * @author lp
 * @mender：（文件的修改者，文件创建者之外的人）
 * @version 1.0
 * Remark：认为有必要的其他信息
 */
@Service
public class PageService {

	/**
	 * 查询条件
	 */
	protected List<SearchCondition> searchConditions;
	
	/**
	 * 翻页条件
	 */
	protected PageRequest pRequest;
	
	/**
	 * 
	 * 功能:构建查询条件
	 * 作者: lp
	 * 创建日期:2016年9月18日
	 * @param queryDto
	 * @throws IOException
	 */
	public void buildCondition(EZQueryDto queryDto) throws IOException{
		ObjectMapper objectMapper = new ObjectMapper();
		searchConditions=new ArrayList<SearchCondition>();
		if (null!=queryDto.getFilter()&& !"".equals(queryDto.getFilter())){
			searchConditions = objectMapper.readValue(queryDto.getFilter(),new TypeReference<List<SearchCondition>>() {});
		}
		SearchCondition Order=new SearchCondition();
		Order.setName(queryDto.getSort());
		Order.setOperator(queryDto.getOrder());
		Order.setValue("orderBy");
		searchConditions.add(Order);
		pRequest=new PageRequest(queryDto.getPage()-1, queryDto.getRows());
	}
	
	
}
