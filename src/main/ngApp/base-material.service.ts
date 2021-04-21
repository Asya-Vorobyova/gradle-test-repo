import { ButtonDefinition } from "../../../modules/form/models/ButtonDefinition";
import { FieldConfig } from "../../../modules/fieldConfig/models/FieldConfig";
import { Material } from "../models/Material";


/**
 * The BaseMaterialService.
 *
 * @author Carmona Benitez, Rafael <rcarmona@stroeer.de>
 * @since 12.07.2019
 */
export abstract class BaseMaterialService {

    /**
     * Returns a {@link Material}-Object created from an object
     * @returns {Material}
     */
    public createMaterialFromJSON( jsonObj: Object ): Material {
        const material = new Material();

        if ( jsonObj[ 'id' ] ) {
            // usage in listview
            material.id = FieldConfig.from('id', jsonObj);
        } else {
            // usage in details
            material.id = FieldConfig.from('materialId', jsonObj);
        }

        material.materialNumber = FieldConfig.from( 'materialNumber', jsonObj );
        material.title = FieldConfig.from( 'title', jsonObj );
        material.description = FieldConfig.from( 'description', jsonObj );
        material.creationTime = FieldConfig.from( 'creationTime', jsonObj );
        material.updateTime = FieldConfig.from( 'updateTime', jsonObj );
        material.closingTime = FieldConfig.from( 'closingTime', jsonObj );
        material.sap = FieldConfig.from( 'sap', jsonObj );

        // // Map buttons
        // if ( jsonObj[ 'mainFunctions' ] ) {
        //     material.mainFunctions = ButtonDefinition.fromJSONObject( jsonObj[ 'mainFunctions' ] );
        // }

        return material;
    }

}
