package com.bbva.longpooling;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.async.DeferredResult;

/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {

	private static final Logger logger = LoggerFactory
			.getLogger(HomeController.class);
	
	//private List<DeferredResult<String>> reqs = new ArrayList<DeferredResult<String>>();
	
	private Map<String, DeferredResult<String>> reqs = new ConcurrentHashMap<String, DeferredResult<String>>();


	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = "/async", method = RequestMethod.GET)
	@ResponseBody
	public DeferredResult<String> home() {
		DeferredResult<String> result = new DeferredResult<String>(0);
		//reqs.add(result);
		reqs.put(UUID.randomUUID().toString(), result);
		return result;
	}
	
	@RequestMapping(value = "/send/{data}", method = RequestMethod.GET)
	@ResponseBody
	public String send(@PathVariable String data) {
		long startTime = java.lang.System.currentTimeMillis();
		int i = 0;		
		for (Entry<String, DeferredResult<String>> entry : this.reqs.entrySet()) {
		    entry.getValue().setResult(data + "\n");
		    //entry.getKey();
		    i++;
		}
		reqs.clear();
		long endTime = java.lang.System.currentTimeMillis();
		long totalTime = endTime - startTime;
		return "Done " + i + " responses in " + totalTime + "ms";
	}
}
