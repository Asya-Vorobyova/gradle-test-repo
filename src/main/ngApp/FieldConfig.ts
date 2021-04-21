export class FieldConfig {

    /** Description/label that gets displayed alongside the edit */
    public name: string;

    /** The displayed value */
    public value: Object;

    /** The identifying string for the field that should be used when checking for certain fields (instead of name) */
    public identifier: string;

    /** Flag if the field is editable by the user */
    public editable: boolean;

    /** Flag if the field needs to contain a value */
    public mandatory: boolean;

    /** A list of all selectable options, only for select-fields */
    public options: SelectOptionList;

    /** endpoint url to request options for select / multiselect */
    public optionsTarget: string;

    /** Set of FieldConfig-identifiers that this field depends on. This needs to be resolved by outside components. */
    public optionsTargetDependsOn: Map<string, FieldConfig>;

    /** The ID of the currently selected options, only for select-fields */
    public selectedOptionIDs: Set<string>;

    /** Determines which input-element or component gets displayed */
    public format: FieldConfigEditFormat;

    /** Will be displayed inline if set to anything other than undefined */
    public errorMessage: string;

    /** Will be displayed inline if set to anything other than undefined */
    public infoMessage: string;

    /** Determines against which pattern the fieldconfig gets validated before saving  */
    public validationType = FieldConfigValidationType.None;

    /** Optional. Used to validate a field's length */
    public minLength: number;

    /** Optional. Used to validate a field's length */
    public maxLength: number;

    /** Displays an icon next to the FieldConfig's value (only in non-edit mode) */
    public iconName: string;

    /** Text that gets displayed as a placeholder for inputs */
    public placeholderText: string;

    public updateTarget: string;

    /**
     * Map of FieldConfig-identifiers that this field depends on. The key contains a object-reference to the dependent FieldConfig
     */
    public updateTargetDependsOn: Map<string, FieldConfig>;

    /**
     * Holds a list of {@link SelectOption} that are used for checkboxes.
     */
    public checkboxes: Array<SelectOption>;

    /**
     * If it is true and it is necessary to validate this field, the length will be counted without white spaces
     */
    public removeWhitespaces: boolean;

    /**
     * If it is necessary add a new class to have multiline with ellipsis, this value will be true
     */
    public isMultilineEllipsis: boolean;

    /**
     * Used when the field config is a link
     */
    public url: string;

    /**
     * Parses a JSON-Structure or value to a FieldConfig-object. If provided JSON-Object or it's name is null or undefined,
     * the returned FieldConfig will also be undefined!
     * @param {string} identifier
     * @param {Object} obj
     * @returns {FieldConfig}
     */
    public static from( identifier: string, obj: Object ): FieldConfig {
        let fieldConfig: FieldConfig;

        // Check if the property exists on the object and if it has a name-attribut to identify it
        if ( obj[identifier] && obj[identifier][ 'name' ] ) {
            fieldConfig = new FieldConfig();
            fieldConfig.parseJSON( identifier, obj );
        }

        // If the value is provided without an actual FieldConfig-structure (e.g. just a "raw" value) we still
        // need to wrap it in a FieldConfig-object, so manually create it. This should only affect readonly fields
        if (!fieldConfig) {
            fieldConfig = new FieldConfig();
            fieldConfig.value = obj[ identifier ];
            fieldConfig.format = FieldConfigEditFormat.Text;
        }

        return fieldConfig;
    }

    /**
     * Parses the provided JSON-Structure and assigns all attributes to the internal FieldConfig properties
     * @param {string} identifier
     * @param {Object} obj
     * @returns {FieldConfig}
     */
    private parseJSON( identifier: string, obj: Object ): void {
        const jsonObj = obj[ identifier ];

        // Parse provided attributes
        this.identifier = identifier;
        this.errorMessage = jsonObj[ 'error' ];
        this.editable = jsonObj[ 'editable' ];
        this.name = jsonObj[ 'name' ];
        this.format = jsonObj[ 'format' ];
        this.placeholderText = jsonObj[ 'placeholderText' ] ? jsonObj[ 'placeholderText' ] : "";
        this.mandatory = jsonObj[ 'mandatory' ];
        this.infoMessage = jsonObj['infoText'];

        // build options
        this.createOptions( jsonObj );

        // FIXME: review, pass Set as value for displaying selected values beneath typeahead
        if ( this.format === FieldConfigEditFormat.MultiSelect ) {
            if ( jsonObj[ 'value' ] instanceof Array ) {
                this.value = jsonObj[ 'value' ];

            } else {
                this.value = new Array();
                for ( const prop in jsonObj[ 'value' ] ) {
                    ( this.value as Array<string> ).push( jsonObj[ 'value' ][ prop ] );
                }
            }
        } else if ( this.format === FieldConfigEditFormat.Datetime ) {
            // date format returned from backend is 2018-08-06T13:04:24.645+0200
            const date: Date = new Date( jsonObj[ 'value' ] );

            this.value = !isNaN(date.getTime()) ? date.getTime() : undefined;

        } else {
            this.value = jsonObj[ 'value' ];
        }

        // Always convert selected options Ids into a set
        if ( jsonObj[ 'id' ] instanceof Array ) {
            this.selectedOptionIDs = new Set( jsonObj[ 'id' ] );
        } else {
            this.selectedOptionIDs = new Set( [ jsonObj[ 'id' ] ] );
        }

        // Assign optionsTarget
        if ( jsonObj[ 'optionsTarget' ] ) {
            this.optionsTarget = jsonObj[ 'optionsTarget' ][ 'target' ];
            this.optionsTargetDependsOn = this.createDependsOnMap( jsonObj[ 'optionsTarget' ] );
        }

        // Assign updateTarget
        if ( jsonObj[ 'updateTarget' ] ) {
            // TODO: updateTarget should always contain a target attribute (must be corrected in backend)
            this.updateTarget = jsonObj[ 'updateTarget' ][ 'target' ] !== undefined ?
                jsonObj[ 'updateTarget' ][ 'target' ] : jsonObj[ 'updateTarget' ];

            this.updateTargetDependsOn = this.createDependsOnMap( jsonObj[ 'updateTarget' ] );
        }

        // Build checkboxes
        this.createCheckboxes( jsonObj );

        // Map number to text but change its validation format
        if ( jsonObj[ 'format' ] === "number" ) {
            this.format = FieldConfigEditFormat.Text;
            this.validationType = FieldConfigValidationType.Number;
        }

        // Differentiate between DateTime & simple Date validation
        if ( this.format === FieldConfigEditFormat.Date || this.format === FieldConfigEditFormat.Datetime ) {
            // Set validation types for date and datetime
            if ( this.format === FieldConfigEditFormat.Datetime ) {
                this.validationType = FieldConfigValidationType.DateTime;

            } else {
                this.validationType = FieldConfigValidationType.Date;
            }
        }

        // Text gets implicitly set if no other format is provided
        if ( this && !this.format ) {
            this.format = FieldConfigEditFormat.Text;
        }
    }

    /**
     * Initializes a dependsOn-Map with all FieldConfig-identifiers, but empty object-references.
     * @param {Object} jsonObj
     * @returns {Map<string, FieldConfig>}
     */
    private createDependsOnMap( jsonObj: Object ): Map<string, FieldConfig> {
        const dependsOnMap = new Map<string, FieldConfig>();

        if ( jsonObj[ "dependsOn" ] ) {

            // Add all identifiers with empty object references that need to be resolved when needed
            jsonObj[ "dependsOn" ].forEach( ( identifier: string ) => {
                dependsOnMap.set( identifier, undefined );
            } );
        }

        return dependsOnMap;
    }

    /**
     * Creates the checkbox-Attribute with the provided JSON structure
     * @param {Object} jsonObj
     */
    private createCheckboxes( jsonObj: Object ): void {
        if ( jsonObj[ 'checkboxes' ] ) {
            this.checkboxes = jsonObj[ 'checkboxes' ].map( ( data: Object ) => {
                return new SelectOption(data[ 'id' ], data[ 'name' ], "", data[ 'selected' ]);
            } );

            // Build selected IDs for value property
            this.value = {};
            this.checkboxes.forEach( ( checkbox: SelectOption ) => {
                this.value[ checkbox.id ] = checkbox.checked;
            } );
        }
    }

    /**
     * Creates the FieldConfig's option list, if it's already provided
     * @param {Object} jsonObj
     */
    private createOptions( jsonObj: Object ): void {
        if ( jsonObj[ 'options' ] ) {
            this.options = jsonObj[ 'options' ].map( ( data: Object ) => {
                const selectOption = SelectOption.fromJSON(data);

                // set preselection of option
                selectOption.checked = (selectOption.id === jsonObj[ 'id' ]);

                return selectOption;
            } );

            // Build selected IDs for value property
            this.value = {};
            this.options.forEach( ( item: SelectOption ) => {
                this.value[ item.id ] = item.checked;
            } );
        }
    }

    /**
     * Helper-function to determine if the current edit is a singleselect select
     * @returns {boolean}
     */
    public get isSingleSelect(): boolean {
        return this.format === FieldConfigEditFormat.Select ||
            this.format === FieldConfigEditFormat.Dropdown ||
            this.format === FieldConfigEditFormat.Radio;
    }

    /**
     * Helper-function to determine if the current edit is a multiselect select
     * @returns {boolean}
     */
    public get isMultiSelect(): boolean {
        return this.format === FieldConfigEditFormat.MultiSelect;
    }

    /**
     * Overwrite the object's toString() method to return its value so that the
     * FieldConfig-Objects work with the {@link TableComponent}
     * Returns semicolon-separated string if value is an array of strings
     * @returns {string}
     */
    public toString(): string {
        if ( this.value ) {
            return (this.value instanceof Array) ? this.value.join("; ") :  this.value.toString();
        } else {
            return "";
        }
    }

}
