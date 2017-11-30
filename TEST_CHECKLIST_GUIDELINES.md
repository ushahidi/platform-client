Testing Scripts should
- Be easy to follow
- Be grouped in a logical way (either page or overarching component, like "Login" or "Filters" or "Saved search") as much as possible
- Reference other tests or groups of tests (ie: when we are done testing saved searches, we make sure that collections are also OK since we might have impacted them) 
- Assume a basic comprehension of the system, to not be overly verbose. 

    ie: we can assume that the user knows how to login if that's a feature we have had for a long time, OR at least link to the login test checklist in the "Login" instruction if we need to be more specific 

- Explicitly test for non happy paths

ie:  If you are desgining a login test checklist, it should include validation errors

- Reflect problems we had in the past (while doing dev or testing, etc), to keep adding to our test suites as we move forward with the platform development.  
    
    Example: if you faced a bug like "the filters don't close when I click the x button" make sure you create a checklist for that. 

- Have tests that consist of steps and preconditions

    Examples: 
    - [Test Script] Saved searches and filters
    - [TEST GROUP] The "SAVE SEARCH" button is displayed correctly
    - [TEST Title] The SAVE SEARCH button is displayed when there are filters.
        - Precondition: There are no filters applied.
        - Precondition: User is logged in
        - View: Map mode
            - Open the filters dropdown.
            - Select any filter.
            - [ ] Expected Result: the SAVE SEARCH button is shown.
        - View: Data mode
            - Open the filters dropdown.
            - Select any filter.
            - [ ] Expected Result: the SAVE SEARCH button
            
- For community members, PULL REQUESTS should include the checklist in the PR itself, as shown in the PULL REQUEST Template.

- For internal usage, our PULL REQUESTS should link to the testing tool where the checklists live, and have notes to what exactly needs to be tested. 

    Example: 
    
    - Testing checklist (https://ushahidi.ontestpad.com/script/2#60/18/)
    - `Specific checklist for this fix:`
        - [x] Go to map-view
        - [x] Select a saved search
        - [x] Add extra filters that don't belong to the saved search
        - [x] Go to data-view
        - [x] The saved search + the filters you added should be active in the data mode 
        
    - Relevant checklists in testpad that are fixed here: 
        - [x] https://ushahidi.ontestpad.com/script/2#60//
        - [x] https://ushahidi.ontestpad.com/script/2#60/18/

    - General checklists that need to be run afterwards to verify nothing new is broken: 
        - [x] Full Filtering and saved searches testpad script :  https://ushahidi.ontestpad.com/script/2
        
- Internal: The I certify that I ran my checklist should ideally link to the test checklist report with the result of the test run.
    - [x] I certify that I ran my checklist . Results here https://ushahidi.ontestpad.com/script/2/report
