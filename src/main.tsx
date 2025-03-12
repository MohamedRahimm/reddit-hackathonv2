import { Devvit } from '@devvit/public-api';

Devvit.configure({
    redditAPI: true,
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
    label: 'Add my post',
    location: 'subreddit',
    forUserType: 'moderator',
    onPress: async (_event, context) => {
        const { reddit, ui } = context;
        ui.showToast("Submitting your post - upon completion you'll navigate there.");

        const subreddit = await reddit.getCurrentSubreddit();
        const post = await reddit.submitPost({
            title: 'My devvit post',
            subredditName: subreddit.name,
            // The preview appears while the post loads
            preview: (
                <vstack height="100%" width="100%" alignment="middle center">
                    <text size="large">Loading ...</text>
                </vstack>
            ),
        });
        ui.navigateTo(post);
    },
});

// Add a post type definition
Devvit.addCustomPostType({
    name: 'Experience Post',
    height: 'regular',
    render: (_context) => {

        return (
            <vstack height="100%" width="100%" gap="medium" alignment="center middle">
                <webview id='mywebview' url='index.html' width="100%" height="100%"></webview>
            </vstack>
        );
    },
});

export default Devvit;
