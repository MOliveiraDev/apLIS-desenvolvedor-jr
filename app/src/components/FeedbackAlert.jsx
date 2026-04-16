export function FeedbackAlert({ feedback }) {
  if (!feedback.message) {
    return null
  }

  return (
    <div className={`feedback ${feedback.type}`} role="status">
      {feedback.message}
    </div>
  )
}
