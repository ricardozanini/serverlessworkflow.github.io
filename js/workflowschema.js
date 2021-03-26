var workflowschema = {
    "$id": "https://serverlessworkflow.org/core/workflow.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Serverless Workflow specification - workflow schema",
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "description": "Workflow unique identifier",
            "minLength": 1
        },
        "name": {
            "type": "string",
            "description": "Workflow name",
            "minLength": 1
        },
        "description": {
            "type": "string",
            "description": "Workflow description"
        },
        "version": {
            "type": "string",
            "description": "Workflow version",
            "minLength": 1
        },
        "start": {
            "$ref": "#/definitions/startdef"
        },
        "schemaVersion": {
            "type": "string",
            "description": "Serverless Workflow schema version",
            "minLength": 1
        },
        "expressionLang": {
            "type": "string",
            "description": "Identifies the expression language used for workflow expressions. Default is 'jq'",
            "default": "jq",
            "minLength": 1
        },
        "execTimeout": {
            "$ref": "#/definitions/exectimeout"
        },
        "keepActive": {
            "type": "boolean",
            "default": false,
            "description": "If 'true', workflow instances is not terminated when there are no active execution paths. Instance can be terminated via 'terminate end definition' or reaching defined 'execTimeout'"
        },
        "metadata": {
            "$ref": "#/definitions/metadata"
        },
        "events": {
            "$ref": "#/definitions/events"
        },
        "functions": {
            "$ref": "#/definitions/functions"
        },
        "retries": {
            "$ref": "#/definitions/retries"
        },
        "states": {
            "type": "array",
            "description": "State definitions",
            "items": {
                "anyOf": [
                    {
                        "title": "Delay State",
                        "$ref": "#/definitions/delaystate"
                    },
                    {
                        "title": "Event State",
                        "$ref": "#/definitions/eventstate"
                    },
                    {
                        "title": "Operation State",
                        "$ref": "#/definitions/operationstate"
                    },
                    {
                        "title": "Parallel State",
                        "$ref": "#/definitions/parallelstate"
                    },
                    {
                        "title": "Switch State",
                        "$ref": "#/definitions/switchstate"
                    },
                    {
                        "title": "SubFlow State",
                        "$ref": "#/definitions/subflowstate"
                    },
                    {
                        "title": "Inject State",
                        "$ref": "#/definitions/injectstate"
                    },
                    {
                        "title": "ForEach State",
                        "$ref": "#/definitions/foreachstate"
                    },
                    {
                        "title": "Callback State",
                        "$ref": "#/definitions/callbackstate"
                    }
                ]
            },
            "additionalItems": false,
            "minItems": 1
        }
    },
    "required": [
        "id",
        "name",
        "version",
        "start",
        "states"
    ],
    "definitions": {
        "metadata": {
            "type": "object",
            "description": "Metadata information",
            "additionalProperties": {
                "type": "string"
            }
        },
        "retries": {
            "oneOf": [
                {
                    "type": "string",
                    "format": "uri",
                    "description": "URI to a resource containing retry definitions (json or yaml)"
                },
                {
                    "type": "array",
                    "description": "Workflow Retry definitions. Define retry strategies that can be referenced in states onError definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/retrydef"
                    },
                    "additionalItems": false,
                    "minItems": 1
                }
            ]
        },

        "retrydef": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Unique retry strategy name",
                    "minLength": 1
                },
                "delay": {
                    "type": "string",
                    "description": "Time delay between retry attempts (ISO 8601 duration format)"
                },
                "maxDelay": {
                    "type": "string",
                    "description": "Maximum time delay between retry attempts (ISO 8601 duration format)"
                },
                "increment": {
                    "type": "string",
                    "description": "Static value by which the delay increases during each attempt (ISO 8601 time format)"
                },
                "multiplier": {
                    "type": [
                        "number",
                        "string"
                    ],
                    "minimum": 0,
                    "minLength": 1,
                    "multipleOf": 0.01,
                    "description": "Numeric value, if specified the delay between retries is multiplied by this value."
                },
                "maxAttempts": {
                    "type": [
                        "number",
                        "string"
                    ],
                    "minimum": 1,
                    "minLength": 0,
                    "description": "Maximum number of retry attempts."
                },
                "jitter": {
                    "type": [
                        "number",
                        "string"
                    ],
                    "minimum": 0,
                    "maximum": 1,
                    "description": "If float type, maximum amount of random time added or subtracted from the delay between each retry relative to total delay (between 0 and 1). If string type, absolute maximum amount of random time added or subtracted from the delay between each retry (ISO 8601 duration format)"
                }
            },
            "additionalProperties": false,
            "required": [
                "name",
                "maxAttempts"
            ]
        },
        "functions": {
            "oneOf": [
                {
                    "type": "string",
                    "format": "uri",
                    "description": "URI to a resource containing function definitions (json or yaml)"
                },
                {
                    "type": "array",
                    "description": "Workflow function definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/function"
                    },
                    "additionalItems": false,
                    "minItems": 1
                }
            ]
        },
        "function": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Unique function name",
                    "minLength": 1
                },
                "operation": {
                    "type": "string",
                    "description": "If type is `rest`, <path_to_openapi_definition>#<operation_id>. If type is `rpc`, <path_to_grpc_proto_file>#<service_name>#<service_method>. If type is `expression`, defines the workflow expression.",
                    "minLength": 1
                },
                "type": {
                    "type": "string",
                    "description": "Defines the function type. Is either `rest`, `rpc` or `expression`. Default is `rest`",
                    "enum": [
                        "rest",
                        "rpc",
                        "expression"
                    ],
                    "default": "rest"
                }
            },
            "additionalProperties": false,
            "required": [
                "name",
                "operation"
            ]
        },
        "events": {
            "oneOf": [
                {
                    "type": "string",
                    "format": "uri",
                    "description": "URI to a resource containing event definitions (json or yaml)"
                },
                {
                    "type": "array",
                    "description": "Workflow CloudEvent definitions. Defines CloudEvents that can be consumed or produced",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/eventdef"
                    },
                    "additionalItems": false,
                    "minItems": 1
                }
            ]
        },
        "eventdef": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Unique event name",
                    "minLength": 1
                },
                "source": {
                    "type": "string",
                    "description": "CloudEvent source"
                },
                "type": {
                    "type": "string",
                    "description": "CloudEvent type"
                },
                "kind": {
                    "type": "string",
                    "enum": [
                        "consumed",
                        "produced"
                    ],
                    "description": "Defines the CloudEvent as either 'consumed' or 'produced' by the workflow. Default is 'consumed'",
                    "default": "consumed"
                },
                "correlation": {
                    "type": "array",
                    "description": "CloudEvent correlation definitions",
                    "minItems": 1,
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/correlationDef"
                    },
                    "additionalItems": false
                },
                "metadata": {
                    "$ref": "#/definitions/metadata",
                    "description": "Metadata information"
                }
            },
            "additionalProperties": false,
            "if": {
                "properties": {
                    "kind": {
                        "const": "consumed"
                    }
                }
            },
            "then": {
                "required": [
                    "name",
                    "source",
                    "type"
                ]
            },
            "else": {
                "required": [
                    "name",
                    "type"
                ]
            }
        },
        "correlationDef": {
            "type": "object",
            "description": "CloudEvent correlation definition",
            "properties": {
                "contextAttributeName": {
                    "type": "string",
                    "description": "CloudEvent Extension Context Attribute name",
                    "minLength": 1
                },
                "contextAttributeValue": {
                    "type": "string",
                    "description": "CloudEvent Extension Context Attribute value",
                    "minLength": 1
                }
            },
            "additionalProperties": false,
            "required": [
                "contextAttributeName"
            ]
        },
        "crondef": {
            "oneOf": [
                {
                    "type": "string",
                    "description": "Cron expression defining when workflow instances should be created (automatically)",
                    "minLength": 1
                },
                {
                    "type": "object",
                    "properties": {
                        "expression": {
                            "type": "string",
                            "description": "Repeating interval (cron expression) describing when the workflow instance should be created",
                            "minLength": 1
                        },
                        "validUntil": {
                            "type": "string",
                            "description": "Specific date and time (ISO 8601 format) when the cron expression invocation is no longer valid"
                        }
                    },
                    "additionalProperties": false,
                    "required": ["expression"]
                }
            ]
        },
        "exectimeout": {
            "type": "object",
            "properties": {
                "duration": {
                    "type": "string",
                    "description": "Timeout duration (ISO 8601 duration format)",
                    "minLength": 1
                },
                "interrupt": {
                    "type": "boolean",
                    "description": "If `false`, workflow instance is allowed to finish current execution. If `true`, current workflow execution is abrupted.",
                    "default": false
                },
                "runBefore": {
                    "type": "string",
                    "description": "Name of a workflow state to be executed before workflow instance is terminated",
                    "minLength": 1
                }
            },
            "additionalProperties": false,
            "required": [
                "duration"
            ]
        },
        "transition": {
            "oneOf": [
                {
                    "type": "string",
                    "description": "Name of state to transition to",
                    "minLength": 1
                },
                {
                    "type": "object",
                    "description": "Function Reference",
                    "properties": {
                        "nextState": {
                            "type": "string",
                            "description": "Name of state to transition to",
                            "minLength": 1
                        },
                        "produceEvents": {
                            "type": "array",
                            "description": "Array of events to be produced before the transition happens",
                            "items": {
                                "type": "object",
                                "$ref": "#/definitions/produceeventdef"
                            },
                            "additionalItems": false
                        },
                        "compensate": {
                            "type": "boolean",
                            "default": false,
                            "description": "If set to true, triggers workflow compensation when before this transition is taken. Default is false"
                        }
                    },
                    "additionalProperties": false,
                    "required": [
                        "nextState"
                    ]
                }
            ]
        },
        "error": {
            "type": "object",
            "properties": {
                "error": {
                    "type": "string",
                    "description": "Domain-specific error name, or '*' to indicate all possible errors",
                    "minLength": 1
                },
                "code": {
                    "type": "string",
                    "description": "Error code. Can be used in addition to the name to help runtimes resolve to technical errors/exceptions. Should not be defined if error is set to '*'",
                    "minLength": 1
                },
                "retryRef": {
                    "type": "string",
                    "description": "References a unique name of a retry definition.",
                    "minLength": 1
                },
                "transition": {
                    "description": "Transition to next state to handle the error. If retryRef is defined, this transition is taken only if retries were unsuccessful.",
                    "$ref": "#/definitions/transition"
                },
                "end": {
                    "description": "End workflow execution in case of this error. If retryRef is defined, this ends workflow only if retries were unsuccessful.",
                    "$ref": "#/definitions/end"
                }
            },
            "additionalProperties": false,
            "oneOf": [
                {
                    "required": [
                        "error",
                        "transition"
                    ]
                },
                {
                    "required": [
                        "error",
                        "end"
                    ]
                }
            ]
        },
        "onevents": {
            "type": "object",
            "properties": {
                "eventRefs": {
                    "type": "array",
                    "description": "References one or more unique event names in the defined workflow events",
                    "minItems": 1,
                    "items": {
                        "type": "string"
                    },
                    "additionalItems": false
                },
                "actionMode": {
                    "type": "string",
                    "enum": [
                        "sequential",
                        "parallel"
                    ],
                    "description": "Specifies how actions are to be performed (in sequence of parallel)",
                    "default": "sequential"
                },
                "actions": {
                    "type": "array",
                    "description": "Actions to be performed if expression matches",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/action"
                    },
                    "additionalItems": false
                },
                "eventDataFilter": {
                    "description": "Event data filter",
                    "$ref": "#/definitions/eventdatafilter"
                }
            },
            "additionalProperties": false,
            "required": [
                "eventRefs"
            ]
        },
        "action": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Unique action definition name"
                },
                "functionRef": {
                    "oneOf": [
                        {
                            "type": "string",
                            "description": "Name of the referenced function",
                            "minLength": 1
                        },
                        {
                            "type": "object",
                            "description": "Function Reference",
                            "properties": {
                                "refName": {
                                    "type": "string",
                                    "description": "Name of the referenced function"
                                },
                                "arguments": {
                                    "type": "object",
                                    "description": "Function arguments"
                                }
                            },
                            "additionalProperties": false,
                            "required": [
                                "refName"
                            ]
                        }
                    ]
                },
                "eventRef": {
                    "description": "References a 'trigger' and 'result' reusable event definitions",
                    "$ref": "#/definitions/eventref"
                },
                "timeout": {
                    "type": "string",
                    "description": "Time period to wait for function execution to complete"
                },
                "actionDataFilter": {
                    "description": "Action data filter",
                    "$ref": "#/definitions/actiondatafilter"
                }
            },
            "additionalProperties": false,
            "oneOf": [
                {
                    "required": [
                        "functionRef"
                    ]
                },
                {
                    "required": [
                        "eventRef"
                    ]
                }
            ]
        },
        "eventref": {
            "type": "object",
            "description": "Event References",
            "properties": {
                "triggerEventRef": {
                    "type": "string",
                    "description": "Reference to the unique name of a 'produced' event definition"
                },
                "resultEventRef": {
                    "type": "string",
                    "description": "Reference to the unique name of a 'consumed' event definition"
                },
                "data": {
                    "type": [
                        "string",
                        "object"
                    ],
                    "description": "If string type, an expression which selects parts of the states data output to become the data (payload) of the event referenced by 'triggerEventRef'. If object type, a custom object to become the data (payload) of the event referenced by 'triggerEventRef'."
                },
                "contextAttributes": {
                    "type": "object",
                    "description": "Add additional extension context attributes to the produced event",
                    "additionalProperties": {
                        "type": "string"
                    }
                }
            },
            "additionalProperties": false,
            "required": [
                "triggerEventRef",
                "resultEventRef"
            ]
        },
        "branch": {
            "type": "object",
            "description": "Branch Definition",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Branch name"
                },
                "actions": {
                    "type": "array",
                    "description": "Actions to be executed in this branch",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/action"
                    },
                    "additionalItems": false
                },
                "workflowId": {
                    "type": "string",
                    "description": "Unique Id of a workflow to be executed in this branch"
                }
            },
            "additionalProperties": false,
            "oneOf": [
                {
                    "required": [
                        "name",
                        "workflowId"
                    ]
                },
                {
                    "required": [
                        "name",
                        "actions"
                    ]
                }
            ]
        },
        "delaystate": {
            "type": "object",
            "description": "Causes the workflow execution to delay for a specified duration",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "Unique State id",
                    "minLength": 1
                },
                "name": {
                    "type": "string",
                    "description": "State name"
                },
                "type": {
                    "type": "string",
                    "const": "delay",
                    "description": "State type"
                },
                "end": {
                    "$ref": "#/definitions/end",
                    "description": "State end definition"
                },
                "stateDataFilter": {
                    "description": "State data filter",
                    "$ref": "#/definitions/statedatafilter"
                },
                "timeDelay": {
                    "type": "string",
                    "description": "Amount of time (ISO 8601 format) to delay"
                },
                "onErrors": {
                    "type": "array",
                    "description": "States error handling and retries definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/error"
                    },
                    "additionalItems": false
                },
                "transition": {
                    "description": "Next transition of the workflow after the time delay",
                    "$ref": "#/definitions/transition"
                },
                "compensatedBy": {
                    "type": "string",
                    "minLength": 1,
                    "description": "Unique Name of a workflow state which is responsible for compensation of this state"
                },
                "usedForCompensation": {
                    "type": "boolean",
                    "default": false,
                    "description": "If true, this state is used to compensate another state. Default is false"
                },
                "metadata": {
                    "$ref": "#/definitions/metadata"
                }
            },
            "additionalProperties": false,
            "if": {
                "properties": {
                    "usedForCompensation": {
                        "const": true
                    }
                }
            },
            "then": {
                "required": [
                    "name",
                    "type",
                    "timeDelay"
                ]
            },
            "else": {
                "oneOf": [
                    {
                        "required": [
                            "name",
                            "type",
                            "timeDelay",
                            "end"
                        ]
                    },
                    {
                        "required": [
                            "name",
                            "type",
                            "timeDelay",
                            "transition"
                        ]
                    }
                ]
            }
        },
        "eventstate": {
            "type": "object",
            "description": "This state is used to wait for events from event sources, then consumes them and invoke one or more actions to run in sequence or parallel",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "Unique State id",
                    "minLength": 1
                },
                "name": {
                    "type": "string",
                    "description": "State name"
                },
                "type": {
                    "type": "string",
                    "const": "event",
                    "description": "State type"
                },
                "exclusive": {
                    "type": "boolean",
                    "default": true,
                    "description": "If true consuming one of the defined events causes its associated actions to be performed. If false all of the defined events must be consumed in order for actions to be performed"
                },
                "onEvents": {
                    "type": "array",
                    "description": "Define the events to be consumed and optional actions to be performed",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/onevents"
                    },
                    "additionalItems": false
                },
                "timeout": {
                    "type": "string",
                    "description": "Time period to wait for incoming events (ISO 8601 format)"
                },
                "stateDataFilter": {
                    "description": "State data filter",
                    "$ref": "#/definitions/statedatafilter"
                },
                "onErrors": {
                    "type": "array",
                    "description": "States error handling and retries definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/error"
                    },
                    "additionalItems": false
                },
                "transition": {
                    "description": "Next transition of the workflow after all the actions have been performed",
                    "$ref": "#/definitions/transition"
                },
                "end": {
                    "$ref": "#/definitions/end",
                    "description": "State end definition"
                },
                "compensatedBy": {
                    "type": "string",
                    "minLength": 1,
                    "description": "Unique Name of a workflow state which is responsible for compensation of this state"
                },
                "metadata": {
                    "$ref": "#/definitions/metadata"
                }
            },
            "additionalProperties": false,
            "oneOf": [
                {
                    "required": [
                        "name",
                        "type",
                        "onEvents",
                        "end"
                    ]
                },
                {
                    "required": [
                        "name",
                        "type",
                        "onEvents",
                        "transition"
                    ]
                },
                {
                    "required": [
                        "name",
                        "type",
                        "onEvents",
                        "end"
                    ]
                }
            ]
        },
        "operationstate": {
            "type": "object",
            "description": "Defines actions be performed. Does not wait for incoming events",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "Unique State id",
                    "minLength": 1
                },
                "name": {
                    "type": "string",
                    "description": "State name"
                },
                "type": {
                    "type": "string",
                    "const": "operation",
                    "description": "State type"
                },
                "end": {
                    "$ref": "#/definitions/end",
                    "description": "State end definition"
                },
                "stateDataFilter": {
                    "description": "State data filter",
                    "$ref": "#/definitions/statedatafilter"
                },
                "actionMode": {
                    "type": "string",
                    "enum": [
                        "sequential",
                        "parallel"
                    ],
                    "description": "Specifies whether actions are performed in sequence or in parallel",
                    "default": "sequential"
                },
                "actions": {
                    "type": "array",
                    "description": "Actions to be performed",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/action"
                    }
                },
                "onErrors": {
                    "type": "array",
                    "description": "States error handling and retries definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/error"
                    },
                    "additionalItems": false
                },
                "transition": {
                    "description": "Next transition of the workflow after all the actions have been performed",
                    "$ref": "#/definitions/transition"
                },
                "compensatedBy": {
                    "type": "string",
                    "minLength": 1,
                    "description": "Unique Name of a workflow state which is responsible for compensation of this state"
                },
                "usedForCompensation": {
                    "type": "boolean",
                    "default": false,
                    "description": "If true, this state is used to compensate another state. Default is false"
                },
                "metadata": {
                    "$ref": "#/definitions/metadata"
                }
            },
            "additionalProperties": false,
            "if": {
                "properties": {
                    "usedForCompensation": {
                        "const": true
                    }
                }
            },
            "then": {
                "required": [
                    "name",
                    "type",
                    "actions"
                ]
            },
            "else": {
                "oneOf": [
                    {
                        "required": [
                            "name",
                            "type",
                            "actions",
                            "end"
                        ]
                    },
                    {
                        "required": [
                            "name",
                            "type",
                            "actions",
                            "transition"
                        ]
                    },
                    {
                        "required": [
                            "name",
                            "type",
                            "actions",
                            "end"
                        ]
                    }
                ]
            }
        },
        "parallelstate": {
            "type": "object",
            "description": "Consists of a number of states that are executed in parallel",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "Unique State id",
                    "minLength": 1
                },
                "name": {
                    "type": "string",
                    "description": "State name"
                },
                "type": {
                    "type": "string",
                    "const": "parallel",
                    "description": "State type"
                },
                "end": {
                    "$ref": "#/definitions/end",
                    "description": "State end definition"
                },
                "stateDataFilter": {
                    "description": "State data filter",
                    "$ref": "#/definitions/statedatafilter"
                },
                "branches": {
                    "type": "array",
                    "description": "Branch Definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/branch"
                    },
                    "additionalItems": false
                },
                "completionType": {
                    "type": "string",
                    "enum": [
                        "and",
                        "xor",
                        "n_of_m"
                    ],
                    "description": "Option types on how to complete branch execution.",
                    "default": "and"
                },
                "n": {
                    "type": [
                        "number",
                        "string"
                    ],
                    "minimum": 0,
                    "minLength": 0,
                    "description": "Used when completionType is set to 'n_of_m' to specify the 'N' value"
                },
                "onErrors": {
                    "type": "array",
                    "description": "States error handling and retries definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/error"
                    },
                    "additionalItems": false
                },
                "transition": {
                    "description": "Next transition of the workflow after all branches have completed execution",
                    "$ref": "#/definitions/transition"
                },
                "compensatedBy": {
                    "type": "string",
                    "minLength": 1,
                    "description": "Unique Name of a workflow state which is responsible for compensation of this state"
                },
                "usedForCompensation": {
                    "type": "boolean",
                    "default": false,
                    "description": "If true, this state is used to compensate another state. Default is false"
                },
                "metadata": {
                    "$ref": "#/definitions/metadata"
                }
            },
            "additionalProperties": false,
            "if": {
                "properties": {
                    "usedForCompensation": {
                        "const": true
                    }
                }
            },
            "then": {
                "required": [
                    "name",
                    "type",
                    "branches"
                ]
            },
            "else": {
                "oneOf": [
                    {
                        "required": [
                            "name",
                            "type",
                            "branches",
                            "end"
                        ]
                    },
                    {
                        "required": [
                            "name",
                            "type",
                            "branches",
                            "transition"
                        ]
                    },
                    {
                        "required": [
                            "name",
                            "type",
                            "branches",
                            "end"
                        ]
                    }
                ]
            }
        },
        "switchstate": {
            "oneOf": [
                {
                    "$ref": "#/definitions/databasedswitch"
                },
                {
                    "$ref": "#/definitions/eventbasedswitch"
                }
            ]
        },
        "eventbasedswitch": {
            "type": "object",
            "description": "Permits transitions to other states based on events",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "Unique State id",
                    "minLength": 1
                },
                "name": {
                    "type": "string",
                    "description": "State name"
                },
                "type": {
                    "type": "string",
                    "const": "switch",
                    "description": "State type"
                },
                "stateDataFilter": {
                    "description": "State data filter",
                    "$ref": "#/definitions/statedatafilter"
                },
                "eventConditions": {
                    "type": "array",
                    "description": "Defines conditions evaluated against events",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/eventcondition"
                    },
                    "additionalItems": false
                },
                "onErrors": {
                    "type": "array",
                    "description": "States error handling and retries definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/error"
                    },
                    "additionalItems": false
                },
                "eventTimeout": {
                    "type": "string",
                    "description": "If eventConditions is used, defines the time period to wait for events (ISO 8601 format)"
                },
                "default": {
                    "description": "Default transition of the workflow if there is no matching data conditions. Can include a transition or end definition",
                    "$ref": "#/definitions/defaultdef"
                },
                "compensatedBy": {
                    "type": "string",
                    "minLength": 1,
                    "description": "Unique Name of a workflow state which is responsible for compensation of this state"
                },
                "usedForCompensation": {
                    "type": "boolean",
                    "default": false,
                    "description": "If true, this state is used to compensate another state. Default is false"
                },
                "metadata": {
                    "$ref": "#/definitions/metadata"
                }
            },
            "additionalProperties": false,
            "required": [
                "name",
                "type",
                "eventConditions"
            ]
        },
        "databasedswitch": {
            "type": "object",
            "description": "Permits transitions to other states based on data conditions",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "Unique State id",
                    "minLength": 1
                },
                "name": {
                    "type": "string",
                    "description": "State name"
                },
                "type": {
                    "type": "string",
                    "const": "switch",
                    "description": "State type"
                },
                "stateDataFilter": {
                    "description": "State data filter",
                    "$ref": "#/definitions/statedatafilter"
                },
                "dataConditions": {
                    "type": "array",
                    "description": "Defines conditions evaluated against state data",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/datacondition"
                    },
                    "additionalItems": false
                },
                "onErrors": {
                    "type": "array",
                    "description": "States error handling and retries definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/error"
                    },
                    "additionalItems": false
                },
                "default": {
                    "description": "Default transition of the workflow if there is no matching data conditions. Can include a transition or end definition",
                    "$ref": "#/definitions/defaultdef"
                },
                "compensatedBy": {
                    "type": "string",
                    "minLength": 1,
                    "description": "Unique Name of a workflow state which is responsible for compensation of this state"
                },
                "usedForCompensation": {
                    "type": "boolean",
                    "default": false,
                    "description": "If true, this state is used to compensate another state. Default is false"
                },
                "metadata": {
                    "$ref": "#/definitions/metadata"
                }
            },
            "additionalProperties": false,
            "required": [
                "name",
                "type",
                "dataConditions"
            ]
        },
        "defaultdef": {
            "type": "object",
            "description": "Default definition. Can be either a transition or end definition",
            "properties": {
                "transition": {
                    "$ref": "#/definitions/transition"
                },
                "end": {
                    "$ref": "#/definitions/end"
                }
            },
            "additionalProperties": false,
            "oneOf": [
                {
                    "required": [
                        "transition"
                    ]
                },
                {
                    "required": [
                        "end"
                    ]
                }
            ]
        },
        "eventcondition": {
            "oneOf": [
                {
                    "$ref": "#/definitions/transitioneventcondition"
                },
                {
                    "$ref": "#/definitions/enddeventcondition"
                }
            ]
        },
        "transitioneventcondition": {
            "type": "object",
            "description": "Switch state data event condition",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Event condition name"
                },
                "eventRef": {
                    "type": "string",
                    "description": "References an unique event name in the defined workflow events"
                },
                "transition": {
                    "description": "Next transition of the workflow if there is valid matches",
                    "$ref": "#/definitions/transition"
                },
                "eventDataFilter": {
                    "description": "Event data filter definition",
                    "$ref": "#/definitions/eventdatafilter"
                },
                "metadata": {
                    "$ref": "#/definitions/metadata"
                }
            },
            "additionalProperties": false,
            "required": [
                "eventRef",
                "transition"
            ]
        },
        "enddeventcondition": {
            "type": "object",
            "description": "Switch state data event condition",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Event condition name"
                },
                "eventRef": {
                    "type": "string",
                    "description": "References an unique event name in the defined workflow events"
                },
                "end": {
                    "$ref": "#/definitions/end",
                    "description": "Explicit transition to end"
                },
                "eventDataFilter": {
                    "description": "Event data filter definition",
                    "$ref": "#/definitions/eventdatafilter"
                },
                "metadata": {
                    "$ref": "#/definitions/metadata"
                }
            },
            "additionalProperties": false,
            "required": [
                "eventRef",
                "end"
            ]
        },
        "datacondition": {
            "oneOf": [
                {
                    "$ref": "#/definitions/transitiondatacondition"
                },
                {
                    "$ref": "#/definitions/enddatacondition"
                }
            ]
        },
        "transitiondatacondition": {
            "type": "object",
            "description": "Switch state data based condition",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Data condition name"
                },
                "condition": {
                    "type": "string",
                    "description": "Workflow expression evaluated against state data. Must evaluate to true or false"
                },
                "transition": {
                    "description": "Workflow transition if condition is evaluated to true",
                    "$ref": "#/definitions/transition"
                },
                "metadata": {
                    "$ref": "#/definitions/metadata"
                }
            },
            "additionalProperties": false,
            "required": [
                "condition",
                "transition"
            ]
        },
        "enddatacondition": {
            "type": "object",
            "description": "Switch state data based condition",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Data condition name"
                },
                "condition": {
                    "type": "string",
                    "description": "Workflow expression evaluated against state data. Must evaluate to true or false"
                },
                "end": {
                    "$ref": "#/definitions/end",
                    "description": "Workflow end definition"
                },
                "metadata": {
                    "$ref": "#/definitions/metadata"
                }
            },
            "additionalProperties": false,
            "required": [
                "condition",
                "end"
            ]
        },
        "subflowstate": {
            "type": "object",
            "description": "Defines a sub-workflow to be executed",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "Unique state id",
                    "minLength": 1
                },
                "name": {
                    "type": "string",
                    "description": "State name"
                },
                "type": {
                    "type": "string",
                    "const": "subflow",
                    "description": "State type"
                },
                "end": {
                    "$ref": "#/definitions/end",
                    "description": "State end definition"
                },
                "waitForCompletion": {
                    "type": "boolean",
                    "default": false,
                    "description": "Workflow execution must wait for sub-workflow to finish before continuing"
                },
                "workflowId": {
                    "type": "string",
                    "description": "Sub-workflow unique id"
                },
                "repeat": {
                    "$ref": "#/definitions/repeat",
                    "description": "SubFlow state repeat exec definition"
                },
                "stateDataFilter": {
                    "description": "State data filter",
                    "$ref": "#/definitions/statedatafilter"
                },
                "onErrors": {
                    "type": "array",
                    "description": "States error handling and retries definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/error"
                    },
                    "additionalItems": false
                },
                "transition": {
                    "description": "Next transition of the workflow after SubFlow has completed execution",
                    "$ref": "#/definitions/transition"
                },
                "compensatedBy": {
                    "type": "string",
                    "minLength": 1,
                    "description": "Unique Name of a workflow state which is responsible for compensation of this state"
                },
                "usedForCompensation": {
                    "type": "boolean",
                    "default": false,
                    "description": "If true, this state is used to compensate another state. Default is false"
                },
                "metadata": {
                    "$ref": "#/definitions/metadata"
                }
            },
            "additionalProperties": false,
            "if": {
                "properties": {
                    "usedForCompensation": {
                        "const": true
                    }
                }
            },
            "then": {
                "required": [
                    "name",
                    "type",
                    "workflowId"
                ]
            },
            "else": {
                "oneOf": [
                    {
                        "required": [
                            "name",
                            "type",
                            "workflowId",
                            "end"
                        ]
                    },
                    {
                        "required": [
                            "name",
                            "type",
                            "workflowId",
                            "transition"
                        ]
                    }
                ]
            }
        },
        "injectstate": {
            "type": "object",
            "description": "Inject static data into state data. Does not perform any actions",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "Unique state id",
                    "minLength": 1
                },
                "name": {
                    "type": "string",
                    "description": "State name"
                },
                "type": {
                    "type": "string",
                    "const": "inject",
                    "description": "State type"
                },
                "end": {
                    "$ref": "#/definitions/end",
                    "description": "State end definition"
                },
                "data": {
                    "type": "object",
                    "description": "JSON object which can be set as states data input and can be manipulated via filters"
                },
                "stateDataFilter": {
                    "description": "State data filter",
                    "$ref": "#/definitions/statedatafilter"
                },
                "transition": {
                    "description": "Next transition of the workflow after subflow has completed",
                    "$ref": "#/definitions/transition"
                },
                "compensatedBy": {
                    "type": "string",
                    "minLength": 1,
                    "description": "Unique Name of a workflow state which is responsible for compensation of this state"
                },
                "usedForCompensation": {
                    "type": "boolean",
                    "default": false,
                    "description": "If true, this state is used to compensate another state. Default is false"
                },
                "metadata": {
                    "$ref": "#/definitions/metadata"
                }
            },
            "additionalProperties": false,
            "if": {
                "properties": {
                    "usedForCompensation": {
                        "const": true
                    }
                }
            },
            "then": {
                "required": [
                    "name",
                    "type",
                    "data"
                ]
            },
            "else": {
                "oneOf": [
                    {
                        "required": [
                            "name",
                            "type",
                            "data",
                            "end"
                        ]
                    },
                    {
                        "required": [
                            "name",
                            "type",
                            "data",
                            "transition"
                        ]
                    }
                ]
            }
        },
        "foreachstate": {
            "type": "object",
            "description": "Execute a set of defined actions or workflows for each element of a data array",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "Unique State id",
                    "minLength": 1
                },
                "name": {
                    "type": "string",
                    "description": "State name"
                },
                "type": {
                    "type": "string",
                    "const": "foreach",
                    "description": "State type"
                },
                "end": {
                    "$ref": "#/definitions/end",
                    "description": "State end definition"
                },
                "inputCollection": {
                    "type": "string",
                    "description": "Workflow expression selecting an array element of the states data"
                },
                "outputCollection": {
                    "type": "string",
                    "description": "Workflow expression specifying an array element of the states data to add the results of each iteration"
                },
                "iterationParam": {
                    "type": "string",
                    "description": "Name of the iteration parameter that can be referenced in actions/workflow. For each parallel iteration, this param should contain an unique element of the inputCollection array"
                },
                "max": {
                    "type": [
                        "number",
                        "string"
                    ],
                    "minimum": 0,
                    "minLength": 0,
                    "description": "Specifies how upper bound on how many iterations may run in parallel"
                },
                "actions": {
                    "type": "array",
                    "description": "Actions to be executed for each of the elements of inputCollection",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/action"
                    },
                    "additionalItems": false
                },
                "workflowId": {
                    "type": "string",
                    "description": "Unique Id of a workflow to be executed for each of the elements of inputCollection"
                },
                "stateDataFilter": {
                    "description": "State data filter",
                    "$ref": "#/definitions/statedatafilter"
                },
                "onErrors": {
                    "type": "array",
                    "description": "States error handling and retries definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/error"
                    },
                    "additionalItems": false
                },
                "transition": {
                    "description": "Next transition of the workflow after state has completed",
                    "$ref": "#/definitions/transition"
                },
                "compensatedBy": {
                    "type": "string",
                    "minLength": 1,
                    "description": "Unique Name of a workflow state which is responsible for compensation of this state"
                },
                "usedForCompensation": {
                    "type": "boolean",
                    "default": false,
                    "description": "If true, this state is used to compensate another state. Default is false"
                },
                "metadata": {
                    "$ref": "#/definitions/metadata"
                }
            },
            "additionalProperties": false,
            "if": {
                "properties": {
                    "usedForCompensation": {
                        "const": true
                    }
                }
            },
            "then": {
                "required": [
                    "name",
                    "type",
                    "inputCollection",
                    "iterationParam",
                    "workflowId"
                ]
            },
            "else": {
                "oneOf": [
                    {
                        "required": [
                            "name",
                            "type",
                            "inputCollection",
                            "iterationParam",
                            "workflowId",
                            "end"
                        ]
                    },
                    {
                        "required": [
                            "name",
                            "type",
                            "inputCollection",
                            "iterationParam",
                            "workflowId",
                            "transition"
                        ]
                    },
                    {
                        "required": [
                            "name",
                            "type",
                            "inputCollection",
                            "iterationParam",
                            "actions",
                            "end"
                        ]
                    },
                    {
                        "required": [
                            "name",
                            "type",
                            "inputCollection",
                            "iterationParam",
                            "actions",
                            "transition"
                        ]
                    }
                ]
            }
        },
        "callbackstate": {
            "type": "object",
            "description": "This state performs an action, then waits for the callback event that denotes completion of the action",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "Unique state id",
                    "minLength": 1
                },
                "name": {
                    "type": "string",
                    "description": "State name"
                },
                "type": {
                    "type": "string",
                    "const": "callback",
                    "description": "State type"
                },
                "action": {
                    "description": "Defines the action to be executed",
                    "$ref": "#/definitions/action"
                },
                "eventRef": {
                    "type": "string",
                    "description": "References an unique callback event name in the defined workflow events"
                },
                "timeout": {
                    "type": "string",
                    "description": "Time period to wait for incoming events (ISO 8601 format)"
                },
                "eventDataFilter": {
                    "description": "Event data filter",
                    "$ref": "#/definitions/eventdatafilter"
                },
                "stateDataFilter": {
                    "description": "State data filter",
                    "$ref": "#/definitions/statedatafilter"
                },
                "onErrors": {
                    "type": "array",
                    "description": "States error handling and retries definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/error"
                    },
                    "additionalItems": false
                },
                "transition": {
                    "description": "Next transition of the workflow after all the actions have been performed",
                    "$ref": "#/definitions/transition"
                },
                "end": {
                    "$ref": "#/definitions/end",
                    "description": "State end definition"
                },
                "compensatedBy": {
                    "type": "string",
                    "minLength": 1,
                    "description": "Unique Name of a workflow state which is responsible for compensation of this state"
                },
                "usedForCompensation": {
                    "type": "boolean",
                    "default": false,
                    "description": "If true, this state is used to compensate another state. Default is false"
                },
                "metadata": {
                    "$ref": "#/definitions/metadata"
                }
            },
            "additionalProperties": false,
            "if": {
                "properties": {
                    "usedForCompensation": {
                        "const": true
                    }
                }
            },
            "then": {
                "required": [
                    "name",
                    "type",
                    "action",
                    "eventRef",
                    "timeout"
                ]
            },
            "else": {
                "oneOf": [
                    {
                        "required": [
                            "name",
                            "type",
                            "action",
                            "eventRef",
                            "timeout",
                            "end"
                        ]
                    },
                    {
                        "required": [
                            "name",
                            "type",
                            "action",
                            "eventRef",
                            "timeout",
                            "transition"
                        ]
                    }
                ]
            }
        },
        "startdef": {
            "oneOf": [
                {
                    "type": "string",
                    "description": "Name of the starting workflow state",
                    "minLength": 1
                },
                {
                    "type": "object",
                    "description": "Workflow start definition",
                    "properties": {
                        "stateName": {
                            "type": "string",
                            "description": "Name of the starting workflow state",
                            "minLength": 1
                        },
                        "schedule": {
                            "description": "Define the time/repeating intervals or cron at which workflow instances should be automatically started.",
                            "$ref": "#/definitions/schedule"
                        }
                    },
                    "additionalProperties": false,
                    "required": [
                        "stateName",
                        "schedule"
                    ]
                }
            ]
        },
        "schedule": {
            "oneOf": [
                {
                    "type": "string",
                    "description": "Time interval (must be repeating interval) described with ISO 8601 format. Declares when workflow instances will be automatically created.  (UTC timezone is assumed)",
                    "minLength": 1
                },
                {
                    "type": "object",
                    "description": "Start state schedule definition",
                    "properties": {
                        "interval": {
                            "type": "string",
                            "description": "Time interval (must be repeating interval) described with ISO 8601 format. Declares when workflow instances will be automatically created.",
                            "minLength": 1
                        },
                        "cron": {
                            "$ref": "#/definitions/crondef"
                        },
                        "timezone": {
                            "type": "string",
                            "description": "Timezone name used to evaluate the interval & cron-expression. (default: UTC)"
                        }
                    },
                    "additionalProperties": false,
                    "oneOf": [
                        {
                            "required": [
                                "interval"
                            ]
                        },
                        {
                            "required": [
                                "cron"
                            ]
                        }
                    ]
                }
            ]
        },
        "end": {
            "oneOf": [
                {
                    "type": "boolean",
                    "description": "State end definition",
                    "default": true
                },
                {
                    "type": "object",
                    "description": "State end definition",
                    "properties": {
                        "terminate": {
                            "type": "boolean",
                            "default": false,
                            "description": "If true, completes all execution flows in the given workflow instance"
                        },
                        "produceEvents": {
                            "type": "array",
                            "description": "Defines events that should be produced",
                            "items": {
                                "type": "object",
                                "$ref": "#/definitions/produceeventdef"
                            },
                            "additionalItems": false
                        },
                        "compensate": {
                            "type": "boolean",
                            "default": false,
                            "description": "If set to true, triggers workflow compensation. Default is false"
                        }
                    },
                    "additionalProperties": false,
                    "required": []
                }
            ]
        },
        "produceeventdef": {
            "type": "object",
            "description": "Produce an event and set its data",
            "properties": {
                "eventRef": {
                    "type": "string",
                    "description": "References a name of a defined event"
                },
                "data": {
                    "type": [
                        "string",
                        "object"
                    ],
                    "description": "If String, expression which selects parts of the states data output to become the data of the produced event. If object a custom object to become the data of produced event."
                },
                "contextAttributes": {
                    "type": "object",
                    "description": "Add additional event extension context attributes",
                    "additionalProperties": {
                        "type": "string"
                    }
                }
            },
            "additionalProperties": false,
            "required": [
                "eventRef"
            ]
        },
        "statedatafilter": {
            "type": "object",
            "properties": {
                "input": {
                    "type": "string",
                    "description": "Workflow expression to filter the state data input"
                },
                "output": {
                    "type": "string",
                    "description": "Workflow expression that filters the state data output"
                }
            },
            "additionalProperties": false,
            "required": []
        },
        "eventdatafilter": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "string",
                    "description": "Workflow expression that filters of the event data (payload)"
                },
                "toStateData": {
                    "type": "string",
                    "description": " Workflow expression that selects a state data element to which the event payload should be added/merged into. If not specified, denotes, the top-level state data element."
                }
            },
            "additionalProperties": false,
            "required": []
        },
        "actiondatafilter": {
            "type": "object",
            "properties": {
                "fromStateData": {
                    "type": "string",
                    "description": "Workflow expression that selects state data that the state action can use"
                },
                "results": {
                    "type": "string",
                    "description": "Workflow expression that filters the actions data results"
                },
                "toStateData": {
                    "type": "string",
                    "description": "Workflow expression that selects a state data element to which the action results should be added/merged into. If not specified, denote, the top-level state data element"
                }
            },
            "additionalProperties": false,
            "required": []
        },
        "repeat": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "Expression evaluated against SubFlow state data. SubFlow will repeat execution as long as this expression is true or until the max property count is reached",
                    "minLength": 1
                },
                "checkBefore": {
                    "type": "boolean",
                    "description": "If true, the expression is evaluated before each repeat execution, if false the expression is evaluated after each repeat execution",
                    "default": true
                },
                "max": {
                    "type": "integer",
                    "description": "Sets the maximum amount of repeat executions",
                    "minimum": 0
                },
                "continueOnError": {
                    "type": "boolean",
                    "description": "If true, repeats executions in a case unhandled errors propagate from the sub-workflow to this state",
                    "default": false
                },
                "stopOnEvents": {
                    "type": "array",
                    "description": "List referencing defined consumed workflow events. SubFlow will repeat execution until one of the defined events is consumed, or until the max property count is reached",
                    "minItems": 1,
                    "items": {
                        "type": "string"
                    },
                    "additionalItems": false
                }
            },
            "additionalProperties": false,
            "required": []
        }
    }
}