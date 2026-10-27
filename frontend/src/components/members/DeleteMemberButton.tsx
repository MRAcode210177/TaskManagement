'use client';

import { deleteMemberAction } from '@/actions/members';
import { Button } from '@/components/ui/Button';

type Props = { id: number; name: string };

export function DeleteMemberButton({ id, name }: Props) {
  return (
    <form
      action={deleteMemberAction.bind(null, id)}
      onSubmit={(event) => {
        // Ask first. Cancel = the form is not sent.
        if (!window.confirm(`Delete ${name}? Their tasks will be deleted too.`)) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="danger">
        Delete
      </Button>
    </form>
  );
}
