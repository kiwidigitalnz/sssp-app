create or replace function transfer_company_ownership(new_owner_id uuid, current_owner_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Update the new owner to be an admin
  update team_members
  set role = 'admin'
  where member_id = new_owner_id;
  
  -- Update the current owner to be a viewer
  update team_members
  set role = 'viewer'
  where member_id = current_owner_id;
end;
$$;