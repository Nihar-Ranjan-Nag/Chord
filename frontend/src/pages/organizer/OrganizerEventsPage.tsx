import {ManagedEventsTable} from '@/components/events/ManagedEventsTable'
export function OrganizerEventsPage(){return <ManagedEventsTable apiBase="/organizer/events" routeBase="/organizer/events" eyebrow="MY EVENTS" title="Organizer events" description="Create new events, update them later, publish them and manage user activity."/>}
