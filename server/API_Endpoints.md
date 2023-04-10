**Endpoints**

| Endpoint                      | Method   | Description                                                                         |
| ----------------------------- | -------- | ----------------------------------------------------------------------------------- |
| `/collection`                 | `GET`    | Returns the collection from the museum.                                             |
| `/collection/:id`             | `GET`    | Returns a single object based on id.                                                |
| `/comments`                   | `GET`    | Returns comments.                                                                   |
| `/mycollection/:id`           | `GET`    | Returns the favorite collection for the specific user.                              |
| --------                      | ------   | ----------------------                                                              |
| `/mycollection/:id`           | `PATCH`  | This adds a liked object to the collection for the specific user.                   |
| --------                      | ------   | ----------------------                                                              |
| `/comments`                   | `POST`   | This will post a comment to the comment collection.                                 |
| `/collection`                 | `POST`   | This will create a favorite collection for the specific user if one does not exist. |
| --------                      | ------   | ----------------------                                                              |
| `/comments/:id`               | `DELETE` | Removes a single comment based on it's id                                           |
| `/mycollection/:id/:objectId` | `DELETE` | Removes a single object from the favorite collection.                               |
| `/mycollection/:id`           | `DELETE` | Removes the entire favorite collection.                                             |
