package com.bbva.longpooling;

import java.util.concurrent.Callable;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.async.DeferredResult;

/**
 * Handles requests for the application home page.
 */
@Controller
public class AsyncController {

	@RequestMapping(value = "/helloSync", method = RequestMethod.GET)
	@ResponseBody
	public String helloSync() {
		return "hi";
	}

	@RequestMapping(value = "/helloAsync", method = RequestMethod.GET)
	@ResponseBody
	public Callable<String> helloAsync() 	{
		/* This will be executed by myTaskExecutor. See servlet-context.xml */
		return new Callable<String>() {
			public String call() throws Exception {
				return "hi";
			}
		};
	}
}
