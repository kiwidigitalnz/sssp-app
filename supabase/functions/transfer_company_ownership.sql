
create or replace function transfer_company_ownership(new_owner_id uuid, current_owner_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Use a single SQL statement instead of two separate updates for better performance
  update team_members
  set role = CASE
    WHEN member_id = new_owner_id THEN 'admin'
    WHEN member_id = current_owner_id THEN 'viewer'
    ELSE role
  END
  where member_id IN (new_owner_id, current_owner_id);
  
  -- Log the ownership transfer in a dedicated audit table
  insert into ownership_transfer_logs (
    previous_owner_id,
    new_owner_id,
    transfer_date,
    transfer_reason
  ) values (
    current_owner_id,
    new_owner_id,
    now(),
    'ownership_transfer'
  );
end;
$$;
