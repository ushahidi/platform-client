Feature: delete posts
    As an admin
    I want to delete posts
    So that I can keep only the needed information in the system

    Scenario Outline: delete a single post
        Given these posts have been created by the public:
            | title              | content       |
            | violence           | man beaten up |
            | political violence | MP kidnapped  |
            | irrelevant post    | SPAM          |
        And the administrator has logged in to the webUI
        And the administrator has opened the data-view on the webUI
        When the administrator deletes the post with the title "<post-to-delete>" using the webUI
        Then there should be 2 posts listed on the webUI
        And the post-count header on the webUI should show "2 of 2 posts"
        Examples:
            | post-to-delete     |
            | violence           |
            | political violence |
            | irrelevant post    |

    Scenario Outline: delete a single post when there are different amount of posts that require pagination
        Given <amount> posts have been created by the public with the title "civil unrest", and the content "description"
        And the administrator has logged in to the webUI
        And the administrator has opened the data-view on the webUI
        When the administrator deletes the post with the title "civil unrest" using the webUI
        Then there should be 19 posts listed on the webUI
        And the post-count header on the webUI should show "<expected-count-header>"
        Examples:
            | amount | expected-count-header |
            | 41     | 19 of 40 posts        |
            | 40     | 19 of 39 posts        |
            | 21     | 19 of 20 posts        |
            | 20     | 19 of 19 posts        |

