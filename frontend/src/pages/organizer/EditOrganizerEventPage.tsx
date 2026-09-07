import {useParams} from 'react-router-dom'
import {EventEditor} from '@/components/events/EventEditor'
export function EditOrganizerEventPage(){const {id}=useParams();return <EventEditor mode="edit" eventId={id} apiBase="/organizer/events" returnPath="/organizer/events" workspaceLabel="ORGANIZER • EVENT STUDIO"/>}
