import { IRoomType, IRoomMapping } from '../models';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  doc,
  getDoc
} from 'firebase/firestore';

export interface ValidationResult {
  status: 'ok' | 'error';
  errors: string[];
  resolvedRoomId?: string;
}

export class MappingService {
  /**
   * Verifies all mappings and reports inconsistencies.
   */
  static async verifyMappings(activeProviders: string[]): Promise<ValidationResult> {
    const errors: string[] = [];
    
    // 1. Get all internal rooms
    const roomTypesRef = collection(db, 'roomTypes');
    const roomTypesSnap = await getDocs(roomTypesRef);
    const internalRooms = roomTypesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as IRoomType));

    // 2. Get all mappings
    const mappingsRef = collection(db, 'roomMappings');
    const mappingsSnap = await getDocs(mappingsRef);
    const mappings = mappingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as IRoomMapping));

    // 1. Check that every internal room has at least one valid mapping for each active provider
    for (const room of internalRooms) {
      for (const provider of activeProviders) {
        const mapping = mappings.find(m => 
          m.internalRoomId === room.id && 
          m.provider === provider
        );
        if (!mapping) {
          errors.push(`Missing mapping: Room "${room.name}" (${room.id}) has no mapping for provider "${provider}"`);
        }
      }
    }

    // 2. Ensure no duplicate mappings exist
    const externalIdMap: Record<string, string> = {}; // provider:externalId -> internalRoomId
    const icalUrlMap: Record<string, string> = {}; // provider:icalUrl -> internalRoomId

    for (const mapping of mappings) {
      const { provider, externalRoomId, icalUrl, internalRoomId } = mapping;
      
      if (externalRoomId) {
        const key = `${provider}:${externalRoomId}`;
        if (externalIdMap[key] && externalIdMap[key] !== internalRoomId) {
          errors.push(`Duplicate externalRoomId: Provider "${provider}" ID "${externalRoomId}" maps to multiple internal rooms`);
        }
        externalIdMap[key] = internalRoomId;
      }

      if (icalUrl) {
        const key = `${provider}:${icalUrl}`;
        if (icalUrlMap[key] && icalUrlMap[key] !== internalRoomId) {
          errors.push(`Duplicate icalUrl: Provider "${provider}" URL "${icalUrl}" maps to multiple internal rooms`);
        }
        icalUrlMap[key] = internalRoomId;
      }

      // 3. Validate that each mapping has a valid internalRoomId and (externalRoomId OR icalUrl)
      if (!externalRoomId && !icalUrl) {
        errors.push(`Invalid mapping: Mapping for room ${internalRoomId} and provider ${provider} must have either externalRoomId or icalUrl`);
      }
    }

    return {
      status: errors.length > 0 ? 'error' : 'ok',
      errors
    };
  }

  /**
   * Resolves an internal room ID from incoming reservation data.
   */
  static async resolveRoomId(data: { source: string; externalRoomId?: string; icalUrl?: string }): Promise<ValidationResult> {
    const { source, externalRoomId, icalUrl } = data;
    const errors: string[] = [];

    const mappingsRef = collection(db, 'roomMappings');
    let q;

    if (icalUrl) {
      q = query(mappingsRef, where('provider', '==', source), where('icalUrl', '==', icalUrl));
    } else if (externalRoomId) {
      q = query(mappingsRef, where('provider', '==', source), where('externalRoomId', '==', externalRoomId));
    } else {
      errors.push(`Missing externalRoomId or icalUrl for provider "${source}"`);
      return { status: 'error', errors };
    }

    const snap = await getDocs(q);
    if (snap.empty) {
      errors.push(`Unknown externalRoomId/icalUrl: No mapping found for provider "${source}" with ID "${externalRoomId}" or URL "${icalUrl}"`);
      return { status: 'error', errors };
    }

    const mapping = snap.docs[0].data() as IRoomMapping;

    return {
      status: 'ok',
      errors: [],
      resolvedRoomId: mapping.internalRoomId
    };
  }

  /**
   * Soft check for room name mismatch.
   */
  static async checkNameMismatch(mappingId: string): Promise<string | null> {
    // Placeholder
    return null;
  }
}
