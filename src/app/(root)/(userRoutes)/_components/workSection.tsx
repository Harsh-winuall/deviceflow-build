import { User } from "@/server/userActions"
import InfoDisplay from "./infoDisplay"

const Work = ({userInfo}:{userInfo:User}) => {
  return (
        <div className="flex flex-col py-4 gap-4">
            <div className="flex flex-wrap justify-between">
                <InfoDisplay 
                    infoText={userInfo.designation} 
                    infoName="designation"
                    infoLabel="Designation"
                    isEditing={false}
                />
                <InfoDisplay 
                    infoText={userInfo.employment_type} 
                    infoLabel="Employment Type"
                    infoName="employment_type"
                    isEditing={false}
                />
            </div>

            <div className="flex flex-wrap justify-between">
                <InfoDisplay 
                    infoText={`${userInfo.reporting_manager.first_name} ${userInfo.reporting_manager.last_name}`} 
                    infoLabel="Reporting Manager"
                    infoName="reporting_manager"
                    isEditing={false}
                />
                <InfoDisplay 
                    infoText={userInfo.onboarding_date} 
                    infoLabel="Joining Date"
                    infoName="onboarding_date"
                    isEditing={false}
                />
            </div>

            <div className="flex flex-wrap justify-between">
                <InfoDisplay 
                    infoText={userInfo?.orgId?.legal_entity_name} 
                    infoLabel="Organization"
                    isEditing={false}
                    infoName="organization"
                />

                <InfoDisplay 
                    infoText={userInfo.teamId?.title} 
                    infoLabel="Team"
                    isEditing={false}
                    infoName="teamId"
                />
            </div>

            <div className="flex flex-wrap justify-between">
                <InfoDisplay 
                    infoText={userInfo?.orgId?.office_address[0].address} 
                    infoLabel="Address"
                    isEditing={false}
                    infoName="address"
                />
            </div>
        </div>
    )
}

export default Work