package com.myplatform.example.crud;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.myplatform.example.crud.dto.CrudDto;
import com.myplatform.example.crud.entity.Crud;
import com.myplatform.example.crud.service.CrudService;
import com.myplatform.query.dto.EZPageDto;
import com.myplatform.query.dto.EZQueryDto;

@Controller
@RequestMapping("example/crud")
public class CrudController {
	
	@Autowired
	private CrudService crudService;
	
	
	/*根据id查询项目*/
	@ResponseBody
	@RequestMapping(value="/getById")
	public Crud getById(@RequestParam(required = false) String id)
	{
		Crud p=crudService.getById(id);
		return p;//==null?new GrapTextGroup():p
	}
	
	@ResponseBody
	@RequestMapping(value="/save", method=RequestMethod.POST )
	public void save(@RequestBody CrudDto dto)
	{
		try {
			crudService.save(dto);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	@ResponseBody
	@RequestMapping(value="/getByEZQuery")
	public EZPageDto GetByEZQuery( EZQueryDto queryDto) throws IOException {
		
		return crudService.findAllByEZQuery(queryDto);
	}
	
	@ResponseBody
	@RequestMapping(value="/delete/{id}", method=RequestMethod.POST )
	public boolean delete(@PathVariable String id)
	{
		return crudService.delete(id);
	}

}
