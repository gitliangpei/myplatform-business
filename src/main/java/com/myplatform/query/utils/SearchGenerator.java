package com.myplatform.query.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaBuilder.In;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

import com.myplatform.query.dto.SearchCondition;


public class SearchGenerator {

	public <T> Specification<T> getSpecification(final List<SearchCondition> conditions) {

		return new Specification<T>() {

			@SuppressWarnings("unchecked")
			@Override
			public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				
				List<Predicate> predicates = new ArrayList<Predicate>();
				List<Order> orders=new ArrayList<Order>();
				
				for(SearchCondition condition : conditions){
//					Type t = root.getClass().getGenericSuperclass();
					Class c = root.get(condition.getName()).getJavaType();
					String  Operator=condition.getOperator();
					Object value = condition.getValue();
					if(value==null||value.equals("")){
						continue;
					}
					if ((!(Operator.equals(SearchOperator.Desc)||Operator.equals(SearchOperator.Asc)))&& c.equals(java.util.Date.class)) {
							SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
							try {
								value = format.parse(condition.getValue());
							} catch (ParseException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
					} 
					
					switch (Operator) {
					case SearchOperator.Equal:
						predicates.add(cb.equal(root.get(condition.getName()), value));
//						query.where(cb.equal(root.get(condition.getName()), value));
						break;
					case SearchOperator.NotEqual:
						predicates.add(cb.notEqual(root.get(condition.getName()), value));
						break;
					case SearchOperator.Like:
						predicates.add(cb.like(root.<String>get(condition.getName()), "%" + value + "%"));
						break;
//					case SearchOperator.GreaterThen:
//						predicates.add(cb.greaterThan(root.<String>get(condition.getName()), (Comparable) value));
//						break;
//					case SearchOperator.GreaterThenOrEqual:
//						predicates.add(cb.greaterThanOrEqualTo(root.<String>get(condition.getName()), (Comparable) value));
//						break;
//					case SearchOperator.LessThen:
//						predicates.add(cb.lessThan(root.<String>get(condition.getName()), (Comparable) value));
//						break;
//					case SearchOperator.LessThenOrEqual:
//						predicates.add(cb.lessThanOrEqualTo(root.<String>get(condition.getName()), (Comparable) value));
//						break;
					case SearchOperator.IsNull:
						predicates.add(cb.isNull(root.get(condition.getName())));
						break;
					case SearchOperator.IsNotNull:
						predicates.add(cb.isNotNull(root.get(condition.getName())));
						break;
					case SearchOperator.In:
						In<Object> in=cb.in(root.get(condition.getName()));
						String[] inValues=value.toString().split(","); 
						for(String invalue:inValues){
							in.value(invalue);
						}
						predicates.add(in);
						break;
					case SearchOperator.NotIn:
						In<Object> notin=cb.in(root.get(condition.getName()));
						String[] notInValues=value.toString().split(","); 
						for(String invalue:notInValues){
							notin.value(invalue);
						}
						predicates.add(cb.not(notin));
						break;
					case SearchOperator.Desc:
						orders.add(cb.desc(root.get(condition.getName())));
						break;
					case SearchOperator.desc:
						orders.add(cb.desc(root.get(condition.getName())));
						break;
					case SearchOperator.Asc:
						orders.add(cb.asc(root.get(condition.getName())));
						break;
					case SearchOperator.asc:
						orders.add(cb.asc(root.get(condition.getName())));
						break;

					}

					query.where(cb.and(predicates.toArray(new Predicate[predicates.size()])));
					query.orderBy(orders);
					
				}
				return null;
			}

		};

		// return null;
	}

}
