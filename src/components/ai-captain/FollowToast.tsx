type FollowToastProps = {
  message: string | null;
};

export function FollowToast({ message }: FollowToastProps) {
  if (!message) return null;

  return (
    <div className="captain-follow-toast" role="status" aria-live="polite">
      <span aria-hidden="true" />
      {message}
    </div>
  );
}
