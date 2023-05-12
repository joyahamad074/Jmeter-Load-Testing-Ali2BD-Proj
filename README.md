# Using-Jmeter-Load-Testing-Ali2BD

**Description:**
This is project about performance test using jmeter for Ali2bd.com. Here I have done this test for different endpoint for Ali2bd.com with setting up different thread.

**Report**
Dear, 

I’ve completed performance test on frequently used API for Ali2BD. 
Test executed for the below mentioned scenario in server https://ali2bd.com/.

For 60 Concurrent Request with 01 Loop Count; Avg TPS for Total Samples is ~ 6 And Total Concurrent API requested: 540.

For 70 Concurrent Request with 01 Loop Count; Avg TPS for Total Samples is ~ 5.2 And Total Concurrent API requested: 630.

For 80 Concurrent Request with 01 Loop Count; Avg TPS for Total Samples is ~ 6 And Total Concurrent API requested: 720.

While executed 70 concurrent request, found  7 request got connection timeout and error rate is 0.73%. 

**Summary:** Server can handle almost concurrent 630 API call with almost zero (0) error rate.
