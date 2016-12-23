package com.myplatform.query.utils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myplatform.query.dto.EZQueryDto;
import com.myplatform.query.dto.SearchCondition;


/**
 * 创建日期:2016年9月28日 下午2:31:21
 * Description: 获取查询条件和分页条件
 * @author chaoxu-yao
 * @mender：（修改者，创建者之外的人）
 * @version 1.0
 * Remark：（备注信息）
 */
public class QueryCriteria {

	//获取查询条件
	public static List<SearchCondition> getSearchCondition(EZQueryDto queryDto) throws IOException {
		
		ObjectMapper objectMapper = new ObjectMapper();
		List<SearchCondition> searchConditions = new ArrayList<SearchCondition>();
		SearchCondition order=new SearchCondition();
		
		//获取过滤条件
		if (null!=queryDto.getFilter()&& !"".equals(queryDto.getFilter())){
			searchConditions = objectMapper.readValue(queryDto.getFilter(),new TypeReference<List<SearchCondition>>() {});
		}
		//获取排序条件
		order.setName(queryDto.getSort());
		order.setOperator(queryDto.getOrder());
		order.setValue("orderBy");
		searchConditions.add(order);
		
		//返回sql所需的过滤条件和排序条件
		return searchConditions;
	}
	
	//获取分页条件
	public static PageRequest getPageRequest(EZQueryDto queryDto) {
		PageRequest pageRequest =new PageRequest(queryDto.getPage(), queryDto.getRows());
		return pageRequest;
	}
}
