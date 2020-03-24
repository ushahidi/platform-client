Feature: pagination of posts
    As an admin
    I want to see all posts
    So that I'm not limited to the first 20 posts

    Scenario Outline: show more posts when there are different amount of posts that require pagination
        Given <amount> posts have been created by the public with the title "civil unrest", and the content "description"
        And the administrator has logged in to the webUI
        And the administrator has opened the data-view on the webUI
        When the administrator loads more posts using the webUI
        Then there should be 40 posts listed on the webUI
        And the post-count header on the webUI should show "<expected-count-header>"
        Examples:
            | amount | expected-count-header |
            | 41     | 40 of 41 posts        |
            | 80     | 40 of 80 posts        |
            | 42     | 40 of 42 posts        |

    Scenario Outline: load-more button should disappear when all posts are loaded
        Given <amount> posts have been created by the public with the title "civil unrest", and the content "description"
        And the administrator has logged in to the webUI
        And the administrator has opened the data-view on the webUI
        When the administrator loads more posts using the webUI
        Then there should be <expected-listed-posts> posts listed on the webUI
        And the post-count header on the webUI should show "<expected-count-header>"
        And there should be no load-more button
        Examples:
            | amount | expected-listed-posts | expected-count-header |
            | 40     | 40                    | 40 of 40 posts        |
            | 21     | 21                    | 21 of 21 posts        |

    Scenario Outline: load-more button should disappear when all posts are loaded (loading more posts twice)
        Given <amount> posts have been created by the public with the title "civil unrest", and the content "description"
        And the administrator has logged in to the webUI
        And the administrator has opened the data-view on the webUI
        When the administrator loads more posts using the webUI
        And the administrator loads more posts using the webUI
        Then there should be <expected-listed-posts> posts listed on the webUI
        And the post-count header on the webUI should show "<expected-count-header>"
        And there should be no load-more button
        Examples:
            | amount | expected-listed-posts | expected-count-header |
            | 60     | 60                    | 60 of 60 posts        |
            | 52     | 52                    | 52 of 52 posts        |

    Scenario Outline: load-more button should still be visible when not all posts are loaded (loading more posts twice)
        Given <amount> posts have been created by the public with the title "civil unrest", and the content "description"
        And the administrator has logged in to the webUI
        And the administrator has opened the data-view on the webUI
        When the administrator loads more posts using the webUI
        And the administrator loads more posts using the webUI
        Then there should be <expected-listed-posts> posts listed on the webUI
        And the post-count header on the webUI should show "<expected-count-header>"
        And there should be a load-more button visible
        Examples:
            | amount | expected-listed-posts | expected-count-header |
            | 80     | 60                    | 60 of 80 posts        |
            | 62     | 60                    | 60 of 62 posts        |

    Scenario Outline: Pagination when a post gets deleted
        Given <amount> posts have been created by the public with the title "civil unrest", and the content "description"
        And the administrator has logged in to the webUI
        And the administrator has opened the data-view on the webUI
        When the administrator deletes the post with the title "civil unrest" using the webUI
        And the administrator loads more posts using the webUI
        Then there should be <expected-listed-posts> posts listed on the webUI
        And the post-count header on the webUI should show "<expected-count-header>"
        Examples:
            | amount | expected-listed-posts | expected-count-header |
            | 41     | 39                    | 39 of 40 posts        |
            | 80     | 39                    | 39 of 79 posts        |
            | 42     | 39                    | 39 of 41 posts        |

    Scenario Outline:  load-more button should disappear when all posts are loaded after deleting a post
        Given <amount> posts have been created by the public with the title "civil unrest", and the content "description"
        And the administrator has logged in to the webUI
        And the administrator has opened the data-view on the webUI
        When the administrator deletes the post with the title "civil unrest" using the webUI
        And the administrator loads more posts using the webUI
        Then there should be <expected-listed-posts> posts listed on the webUI
        And the post-count header on the webUI should show "<expected-count-header>"
        And there should be no load-more button
        Examples:
            | amount | expected-listed-posts | expected-count-header |
            | 37     | 36                    | 36 of 36 posts        |
            | 40     | 39                    | 39 of 39 posts        |
            | 22     | 21                    | 21 of 21 posts        |
