import {EventEditor} from '@/components/events/EventEditor'
export function CreateEventPage(){return <EventEditor mode="create" apiBase="/admin/events" returnPath="/admin/events" workspaceLabel="ADMIN • EVENT MANAGEMENT"/>}
