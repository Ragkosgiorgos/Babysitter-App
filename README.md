# Babysitter App

A web application for managing babysitting services, including user registration, profile management, job postings, and contract handling. It is a redesign of the [government's program](https://ntantades.gov.gr/) for babysitters and parents, focusing on user experience and functionality. 

This project is part of the Human-Computer Interaction course at UOA, Winter 2024. It was graded with a score of 10/10 and was selected to be published in [department's official youtube channel](https://www.youtube.com/watch?v=HxpX3Weyur8) as one of the best projects of the semester.

## Technologies

- Interface designed with [Figma](https://www.figma.com/design/FNbeZMwMOs5xrU0oNIqE8D/EAM_project?node-id=0-1&p=f), 
- Implemented with React,
- Backend powered by Firebase.

## Hosting

Run the following commands to build and run the application using Docker, with all dependencies included:

```bash
docker build -t babysitter-app .
docker run -p 3000:3000 babysitter-app
```

User credentials for testing:
- **Parent**: 
  - Email: `nikoleta@test.com`
    - Password: `test123`

- **Babysitter**:
    - Email: `dimitris@test.com`
        - Password: `test123`

## Firebase

We have <b>disabled write access</b> to the database, as there is no secure API or something to ensure safe access to it. However, Firebase itself does not allow file uploads, so we have made some dummy implementations:
    - <b>Profile picture</b>: Default images are used, depending on the gender the user specifies,
    - <b>Recommendation letters</b>: Implemented in a dummy fashion—each time the user uploads a letter, a link to a dummy PDF file is simply added to their list of letters.

## Application features

For both parents and babysitters, the application supports registration & login/logout functionality, so users can be personalized. After logging in, users can access their dashboard, where they can manage their profile and handle job postings, contracts & ratings.

![login-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/26a89bbd-fae5-415e-94e7-964dc4d40ee9)


<b>Babysitter searching and info</b> are available to all users, even those who are not logged in (no login wall). Users can search for babysitters by many <b>criteria</b>, such as location, child age, availability etc. The search results display a list of babysitters with their basic information, including name, age, and a brief biography.


![search-ezgif com-video-to-gif-converter (1)](https://github.com/user-attachments/assets/22c7012e-f527-4ce7-ac9c-e0b787fb4263)

<b>Payments</b> are made by parents, who confirm babysitter's work for each month and the system automatically provides a voucher for the babysitter, which can be used to receive payment from the government.

![payments-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/05041f95-8592-43cd-8a86-755f5caed8a5)

<b>Registration restrictions</b> (when creating a new user):
    - For <u>parents</u>, at least 18 years old and children between 6 months and 2.5 years old,
    - For <u>babysitters</u>, at least 18 years old.

### Parents

- Discover & Filter babysitters,

- Search by location, availability windows, experience level, child‑age specialties etc,

- View a rich results list (name, age, photo, ratings, brief bio) even before logging in,

- Appointment booking for job discussion,

- Contract generation,

![newcontract-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/a9a945e0-208a-4871-9f59-79535a13809c)


- Confirm hours worked for each month, then automatically generate a voucher for the babysitter,

- Rating for each babysitter who worked for them,

### Babysitters

- Complete a personalized profile & bio: photo, bio, work experience, recommendation letters,

![bio-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/32815cc9-13f8-4571-a6c9-be28ebcdd875)


- Make a job post with service area, preferred child‑age groups etc.,

![newPost-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/02602753-706a-4793-8e8f-0eccba097288)


- Define time slots for meetings with parents,

- Contract handling - Review terms, then accept or decline instantly,

- Job offers & rate management,

- Payment & Voucher Tracking.
