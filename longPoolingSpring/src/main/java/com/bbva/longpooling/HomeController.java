package com.bbva.longpooling;

import java.util.ArrayList;
import java.util.List;
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
	
	private List<DeferredResult<String>> reqs = new ArrayList<DeferredResult<String>>();

	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = "/async", method = RequestMethod.GET)
	@ResponseBody
	public DeferredResult<String> home() {
		DeferredResult<String> result = new DeferredResult<String>(0);
		synchronized(reqs) {
			reqs.add(result);
		}
		return result;
	}
	
	@RequestMapping(value = "/send/{data}", method = RequestMethod.GET)
	@ResponseBody
	public String send(@PathVariable String data) {
		long startTime = java.lang.System.currentTimeMillis();
		int count = reqs.size();
		while (!reqs.isEmpty()) {
			reqs.get(0).setResult(data);
			reqs.remove(0);
		}
		long endTime = java.lang.System.currentTimeMillis();
		long totalTime = endTime - startTime;
		return "Done " + count + " responses in " + totalTime + "ms";
	}
}
