# BugHunters

## First project in c#, Its a bug tracking site!

- Built with dotnet 3.1 and React using a Clean Architecture structure.
- Using EF Core with PostgresSQL and lazy loading for relational data (will use eager loading for future projects).
- Controllers using CQRS mediator pattern.
- Using Mobx for state management on client side.
- Allows creation of groups, a place for members to get relevant news to that group and chat with eachother.
- SignalR for real-time client connection for asynchronous messaging.
- Tickets (issues) are created and attached to specific groups.
- Image and text files hosted on Cloudinary, either for user profiles, group photo or ticket files.
- Hosted on Heroku with their free postgres


- Check it out at <https://bugshunting.herokuapp.com/> (might take a while to load, no traffic sites on free heroku accounts go to sleep)
