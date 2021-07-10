import { useState, useEffect, useContext } from "react";
import NotificationContext from "../../store/notification-context";

import CommentList from "./comment-list";
import NewComment from "./new-comment";
import classes from "./comments.module.css";

function Comments(props) {
  const { eventId } = props;
  const notificationCtx = useContext(NotificationContext);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showComments) {
      setLoading(true);
      fetch(`/api/comments/${eventId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setComments(data.comments);
        })
        .catch(console.log)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [eventId, showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    notificationCtx.showNotification({
      title: "Adding comment!",
      message: `Adding comment for eventId: ${eventId} .`,
      status: "pending",
    });

    fetch(`/api/comments/${eventId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    })
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        const data = await res.json();
        throw new Error(data.message || "Something went wrong!");
      })
      .then((data) => {
        notificationCtx.showNotification({
          title: "Success!",
          message: "Successfully added comment.",
          status: "success",
        });
      })
      .catch((err) => {
        notificationCtx.showNotification({
          title: "Error!",
          message: err.message || "Something went wrong.",
          status: "error",
        });
      });
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && loading && <p className="center">loading...</p>}
      {showComments && comments && !loading && <CommentList items={comments} />}
    </section>
  );
}

export default Comments;
