import {useParams} from 'react-router-dom'
import {EventEditor} from '@/components/events/EventEditor'
export function EditEventPage(){const {id}=useParams();return <EventEditor mode="edit" eventId={id} apiBase="/admin/events" returnPath="/admin/events" workspaceLabel="ADMIN • EVENT MANAGEMENT"/>}
