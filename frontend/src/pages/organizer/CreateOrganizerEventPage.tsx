import {EventEditor} from '@/components/events/EventEditor'
export function CreateOrganizerEventPage(){return <EventEditor mode="create" apiBase="/organizer/events" returnPath="/organizer/events" workspaceLabel="ORGANIZER • EVENT STUDIO"/>}
