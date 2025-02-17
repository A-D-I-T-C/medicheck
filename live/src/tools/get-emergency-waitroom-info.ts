import { parseWaitTime, extractCoordinates, haversineDistance } from '../lib/utils';
import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";

export interface WaitRoomFacility {
  name: string;
  waitTime: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  url: string;
  note: string;
  waitTimeMinutes: number;
  distance: number;
}

export interface EmergencyWaitRoomResponse {
  facilities: WaitRoomFacility[];
  userLocation: {
    lat: number;
    lng: number;
  };
}

interface GetEmergencyWaitRoomInfoProps {
  onWaitRoomInfo: (info: EmergencyWaitRoomResponse) => void;
}

export const getEmergencyWaitRoomInfo = ({ onWaitRoomInfo }: GetEmergencyWaitRoomInfoProps): FunctionDeclaration => ({
  name: "getEmergencyWaitRoomInfo",
  description: "Fetch nearby emergency room wait times and locations based on patient's current location",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      userCity: {
        type: SchemaType.STRING,
        description: "The city where the patient is located",
      },
      urgencyLevel: {
        type: SchemaType.STRING,
        enum: ["low", "medium", "high", "emergency"],
        description: "The assessed urgency level from triage",
      },
      maxDistance: {
        type: SchemaType.NUMBER,
        description: "Maximum distance to search for facilities (in kilometers)",
      }
    },
    required: ["userCity", "urgencyLevel"],
  },
});

export const executeGetEmergencyWaitRoomInfo = async (
  args: { userCity: string; urgencyLevel: string; maxDistance?: number },
  onWaitRoomInfo: (info: EmergencyWaitRoomResponse) => void
) => {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    const response = await fetch(
      "https://www.albertahealthservices.ca/Webapps/WaitTimes/api/waittimes"
    );
    const data = await response.json();
    
    let facilities = data[args.userCity]?.Emergency?.map((facility: any) => {
      const coordinates = extractCoordinates(facility.GoogleMapsLinkDirection);
      const distance = haversineDistance(
        userLocation.lat,
        userLocation.lng,
        coordinates.lat,
        coordinates.lng
      );

      return {
        name: facility.Name,
        waitTime: facility.WaitTime,
        address: facility.Address,
        coordinates,
        url: facility.URL,
        note: facility.Note,
        waitTimeMinutes: parseWaitTime(facility.WaitTime),
        distance
      } as WaitRoomFacility;
    }) ?? [];

    // Filter by distance if maxDistance is specified
    if (args.maxDistance) {
      facilities = facilities.filter((f: WaitRoomFacility) => f.distance <= args.maxDistance!);
    }

    // Sort by wait time and distance
    facilities.sort((a: WaitRoomFacility, b: WaitRoomFacility) => {
      // Prioritize shorter wait times
      const waitDiff = a.waitTimeMinutes - b.waitTimeMinutes;
      if (Math.abs(waitDiff) > 30) return waitDiff; // If wait time difference is significant
      
      // Otherwise consider distance
      return a.distance - b.distance;
    });

    onWaitRoomInfo({ facilities, userLocation });
    return { success: true, message: "Emergency wait room information retrieved" };
  } catch (error) {
    console.error("Error fetching emergency wait room info:", error);
    return { success: false, message: "Failed to retrieve wait room information" };
  }
};
