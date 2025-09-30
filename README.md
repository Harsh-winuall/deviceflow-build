## Device Flow

## Workflows Todo:

- [x] Add react-flow
- [x] Add custom cards
- [x] Add edges and nodes to workflow with dropdown menus
- [x] Rename paths
- [x] Change app on node
- [x] Duplicate node
- [x] Open forms on clicking nodes

- [x] Split path

  - [x] delete btn on split path
  - [x] plus btn (add extra path)

- [ ] Add data (inputs and outputs) (align with backend)

## todo.

- [x] fix app nodes and instruction nodes according to design
- [ ] fix dropdown (rm duplicate option if there is duplicate);
- [ ] check change app, (fix duplicate for changed app)
- [ ] add connect functionality if app is not connected

timestamp - 3:47:56

// https://www.youtube.com/watch?v=RkwbGuL-dzo

### front-end-res

```
{
  _id: '1',
  name: 'Test 1',
  createdAt: '',
  updatedAt: '',
  description: 'description',
  definition: '{"nodes":[{"id":"297ae58d-fce2-4297-8a3d-e11efdcc0b0f","type":"Node","data":{"type":"START","inputs":{"Start":"heyy"}},"position":{"x":150,"y":240},"measured":{"width":75,"height":30},"selected":false,"dragging":false},{"id":"f36fec10-6eb9-422b-ba5f-9fe586a85c12","type":"Node","data":{"type":"APP","pathName":"","appType":"GOOGLE","inputs":{}},"position":{"x":360,"y":150},"measured":{"width":260,"height":138},"selected":false,"dragging":false},{"id":"5ba36c4a-24c5-4048-bb6f-a09b3d206783","type":"Node","data":{"type":"SPLIT","pathName":"","inputs":{}},"position":{"x":810,"y":180},"measured":{"width":48,"height":48},"selected":false,"dragging":false},{"id":"9b3e0a2d-24af-498b-9148-9a7a6e3eadb4","type":"Node","data":{"type":"PATH","pathName":"path a","inputs":{}},"position":{"x":900,"y":30},"measured":{"width":80,"height":34},"selected":false,"dragging":false},{"id":"7d962248-12a5-42b5-9d71-a23a6222fde0","type":"Node","data":{"type":"PATH","pathName":"path b","inputs":{}},"position":{"x":900,"y":390},"measured":{"width":80,"height":34},"selected":false,"dragging":false},{"id":"e21d6db5-393b-434c-bb91-18da782b7239","type":"Node","data":{"type":"PATH","pathName":"path c","inputs":{}},"position":{"x":900,"y":-60},"measured":{"width":80,"height":34},"selected":false,"dragging":false},{"id":"06c53ba5-b02b-4772-a138-7519c61baf6c","type":"Node","data":{"type":"INSTRUCTION","pathName":"","inputs":{}},"position":{"x":1380,"y":-60},"measured":{"width":260,"height":138},"selected":false,"dragging":false},{"id":"d9c0ed19-a491-4ed4-b347-4f3e8f005471","type":"Node","data":{"type":"APP","pathName":"","appType":"ZOOM","inputs":{}},"position":{"x":1050,"y":-180},"measured":{"width":260,"height":138},"selected":false,"dragging":false},{"id":"f47cda77-deee-41e3-bee7-a8c79336b5b2","type":"Node","data":{"type":"PATH","pathName":"path d","inputs":{}},"position":{"x":1020,"y":180},"measured":{"width":80,"height":34},"selected":false,"dragging":false},{"id":"71d3d6eb-4d50-4b7f-ad60-d116df7957a9","type":"Node","data":{"type":"APP","pathName":"","appType":"HUBSPOT","inputs":{}},"position":{"x":1200,"y":210},"measured":{"width":260,"height":138},"selected":false,"dragging":false},{"id":"5546ebf0-aa58-4a74-9d63-a3cc32c4da4d","type":"Node","data":{"type":"SPLIT","pathName":"","inputs":{}},"position":{"x":1680,"y":-70},"measured":{"width":48,"height":48}},{"id":"0549d03f-477d-4332-b2ad-cd0308c8868c","type":"Node","data":{"type":"PATH","pathName":"path a","inputs":{}},"position":{"x":1780,"y":-220},"measured":{"width":80,"height":34},"selected":false},{"id":"feb767f9-fb35-408c-935b-f51fbb154c19","type":"Node","data":{"type":"PATH","pathName":"path b","inputs":{}},"position":{"x":1780,"y":100},"measured":{"width":80,"height":34}},{"id":"08ad86ed-8c4b-4eee-9c6c-29c904e26382","type":"Node","data":{"type":"INSTRUCTION","pathName":"","inputs":{}},"position":{"x":1980,"y":-330},"measured":{"width":260,"height":138},"selected":true,"dragging":false}],"edges":[{"id":"297ae58d-fce2-4297-8a3d-e11efdcc0b0f-web page-f36fec10-6eb9-422b-ba5f-9fe586a85c12-1751446559306-6xn1f2hjf","source":"297ae58d-fce2-4297-8a3d-e11efdcc0b0f","target":"f36fec10-6eb9-422b-ba5f-9fe586a85c12","sourceHandle":"web page","targetHandle":"Start","type":"NORMAL","animated":false,"data":{"type":"NORMAL","sourceHandle":"web page","canAddPath":false,"isTopOrBottom":false}},{"id":"f36fec10-6eb9-422b-ba5f-9fe586a85c12-html-5ba36c4a-24c5-4048-bb6f-a09b3d206783-1751446563589-fggv38lht","source":"f36fec10-6eb9-422b-ba5f-9fe586a85c12","target":"5ba36c4a-24c5-4048-bb6f-a09b3d206783","sourceHandle":"html","targetHandle":"split","type":"NORMAL","animated":false,"data":{"type":"NORMAL","sourceHandle":"html","canAddPath":false,"isTopOrBottom":false},"selected":false},{"id":"5ba36c4a-24c5-4048-bb6f-a09b3d206783-branch-0-9b3e0a2d-24af-498b-9148-9a7a6e3eadb4-1751446563589-tvk5he6ll","source":"5ba36c4a-24c5-4048-bb6f-a09b3d206783","target":"9b3e0a2d-24af-498b-9148-9a7a6e3eadb4","sourceHandle":"branch-0","targetHandle":"paths","type":"SPLIT","animated":false,"data":{"type":"SPLIT","sourceHandle":"branch-0","canAddPath":true,"isTopOrBottom":true},"selected":false},{"id":"5ba36c4a-24c5-4048-bb6f-a09b3d206783-branch-2-7d962248-12a5-42b5-9d71-a23a6222fde0-1751446563589-tbfy950or","source":"5ba36c4a-24c5-4048-bb6f-a09b3d206783","target":"7d962248-12a5-42b5-9d71-a23a6222fde0","sourceHandle":"branch-2","targetHandle":"paths","type":"SPLIT","animated":false,"data":{"type":"SPLIT","sourceHandle":"branch-2","canAddPath":true,"isTopOrBottom":true},"selected":false},{"id":"5ba36c4a-24c5-4048-bb6f-a09b3d206783-branch-0-e21d6db5-393b-434c-bb91-18da782b7239-1751446573708-sk0n8tahp","source":"5ba36c4a-24c5-4048-bb6f-a09b3d206783","target":"e21d6db5-393b-434c-bb91-18da782b7239","sourceHandle":"branch-0","targetHandle":"paths","type":"SPLIT","animated":false,"data":{"type":"SPLIT","sourceHandle":"branch-0","canAddPath":true,"isTopOrBottom":true}},{"id":"9b3e0a2d-24af-498b-9148-9a7a6e3eadb4-output-06c53ba5-b02b-4772-a138-7519c61baf6c-1751446581606-p63xtglze","source":"9b3e0a2d-24af-498b-9148-9a7a6e3eadb4","target":"06c53ba5-b02b-4772-a138-7519c61baf6c","sourceHandle":"output","targetHandle":"Instruction","type":"NORMAL","animated":false,"data":{"type":"NORMAL","sourceHandle":"output","canAddPath":false,"isTopOrBottom":false}},{"id":"e21d6db5-393b-434c-bb91-18da782b7239-output-d9c0ed19-a491-4ed4-b347-4f3e8f005471-1751446587555-mpuo8vlec","source":"e21d6db5-393b-434c-bb91-18da782b7239","target":"d9c0ed19-a491-4ed4-b347-4f3e8f005471","sourceHandle":"output","targetHandle":"Start","type":"NORMAL","animated":false,"data":{"type":"NORMAL","sourceHandle":"output","canAddPath":false,"isTopOrBottom":false}},{"id":"5ba36c4a-24c5-4048-bb6f-a09b3d206783-branch-1-f47cda77-deee-41e3-bee7-a8c79336b5b2-1751446649170-6qcowfpd0","source":"5ba36c4a-24c5-4048-bb6f-a09b3d206783","target":"f47cda77-deee-41e3-bee7-a8c79336b5b2","sourceHandle":"branch-1","targetHandle":"paths","type":"NORMAL","animated":false,"data":{"type":"NORMAL","sourceHandle":"branch-1","canAddPath":false,"isTopOrBottom":false}},{"id":"f47cda77-deee-41e3-bee7-a8c79336b5b2-output-71d3d6eb-4d50-4b7f-ad60-d116df7957a9-1751446670738-iso7ceyv6","source":"f47cda77-deee-41e3-bee7-a8c79336b5b2","target":"71d3d6eb-4d50-4b7f-ad60-d116df7957a9","sourceHandle":"output","targetHandle":"Start","type":"NORMAL","animated":false,"data":{"type":"NORMAL","sourceHandle":"output","canAddPath":false,"isTopOrBottom":false}},{"id":"06c53ba5-b02b-4772-a138-7519c61baf6c-output-5546ebf0-aa58-4a74-9d63-a3cc32c4da4d-1751446681388-9c87w912n","source":"06c53ba5-b02b-4772-a138-7519c61baf6c","target":"5546ebf0-aa58-4a74-9d63-a3cc32c4da4d","sourceHandle":"output","targetHandle":"split","type":"NORMAL","animated":false,"data":{"type":"NORMAL","sourceHandle":"output","canAddPath":false,"isTopOrBottom":false}},{"id":"5546ebf0-aa58-4a74-9d63-a3cc32c4da4d-branch-0-0549d03f-477d-4332-b2ad-cd0308c8868c-1751446681388-ygsnsxhu9","source":"5546ebf0-aa58-4a74-9d63-a3cc32c4da4d","target":"0549d03f-477d-4332-b2ad-cd0308c8868c","sourceHandle":"branch-0","targetHandle":"paths","type":"SPLIT","animated":false,"data":{"type":"SPLIT","sourceHandle":"branch-0","canAddPath":true,"isTopOrBottom":true}},{"id":"5546ebf0-aa58-4a74-9d63-a3cc32c4da4d-branch-2-feb767f9-fb35-408c-935b-f51fbb154c19-1751446681388-ql54ut02t","source":"5546ebf0-aa58-4a74-9d63-a3cc32c4da4d","target":"feb767f9-fb35-408c-935b-f51fbb154c19","sourceHandle":"branch-2","targetHandle":"paths","type":"SPLIT","animated":false,"data":{"type":"SPLIT","sourceHandle":"branch-2","canAddPath":true,"isTopOrBottom":true}},{"id":"0549d03f-477d-4332-b2ad-cd0308c8868c-output-08ad86ed-8c4b-4eee-9c6c-29c904e26382-1751446686204-22otmpwu1","source":"0549d03f-477d-4332-b2ad-cd0308c8868c","target":"08ad86ed-8c4b-4eee-9c6c-29c904e26382","sourceHandle":"output","targetHandle":"Instruction","type":"NORMAL","animated":false,"data":{"type":"NORMAL","sourceHandle":"output","canAddPath":false,"isTopOrBottom":false}}],"viewport":{"x":-137.5,"y":329.8125,"zoom":0.5}}',
  status: 'DRAFT',
  userId: 'testing'
}
```

### backend-api-res:

```
{
    "workflow": {
        "_id": "68494350c65fb6b05024dea2",
        "name": "User Onboarding",
        "status": "draft",
        "startNode": "6849454e6045718eb60c7788"
    },
    "nodes": [
        {
            "_id": "6849454e6045718eb60c7788",
            "orgId": "678a1a10959cf72ab3b66068",
            "workflowId": "68494350c65fb6b05024dea2",
            "token": "token-bdnrqswv",
            "templateKey": "create_user",
            "config": {
                "email": ""
            },
            "next": null,
            "position": {
                "x": 200,
                "y": 100
            },
            "branches": [
                {
                    "label": "Path A",
                    "condition": {
                        "field": "teamId",
                        "operator": "==",
                        "value": "HR"
                    },
                    "next": "684a6d8fc93584c4b4cce3bf",
                    "_id": "684a6d8fc93584c4b4cce3c2"
                },
                {
                    "label": "Path B",
                    "condition": {
                        "field": "teamId",
                        "operator": "==",
                        "value": "Tech"
                    },
                    "next": "684a6da5c93584c4b4cce3c6",
                    "_id": "684a6da6c93584c4b4cce3ca"
                }
            ],
            "createdAt": "2025-06-11T08:58:54.858Z",
            "updatedAt": "2025-06-12T06:03:18.048Z",
            "__v": 0,
            "connectorPosition": {
                "x": 550,
                "y": 620
            },
            "template": {
                "name": "Device Flow",
                "description": "Creates a new user in the system",
                "service": "create User",
                "requiredFields": [
                    "email"
                ],
                "outputFields": [
                    "_id",
                    "email",
                    "first_name",
                    "last_name",
                    "role",
                    "onboarding_date"
                ],
                "createdAt": "1999-12-31T18:30:00.000Z"
            }
        },
        {
            "_id": "684a6d8fc93584c4b4cce3bf",
            "orgId": "678a1a10959cf72ab3b66068",
            "workflowId": "68494350c65fb6b05024dea2",
            "templateKey": "move_user_team",
            "config": {
                "teamId": ""
            },
            "next": null,
            "position": {
                "x": 600,
                "y": 500
            },
            "branches": [],
            "createdAt": "2025-06-12T06:02:55.734Z",
            "updatedAt": "2025-06-12T06:02:55.734Z",
            "__v": 0,
            "template": {
                "name": "Device Flow",
                "description": "Reassigns a user to a different team",
                "service": "Move to Team",
                "requiredFields": [
                    "teamId"
                ],
                "outputFields": [
                    "_id",
                    "teamId"
                ]
            }
        },
        {
            "_id": "684a6da5c93584c4b4cce3c6",
            "orgId": "678a1a10959cf72ab3b66068",
            "workflowId": "68494350c65fb6b05024dea2",
            "templateKey": "move_user_team",
            "config": {
                "teamId": ""
            },
            "next": null,
            "position": {
                "x": 700,
                "y": 600
            },
            "branches": [],
            "createdAt": "2025-06-12T06:03:17.925Z",
            "updatedAt": "2025-06-12T06:03:17.925Z",
            "__v": 0,
            "template": {
                "name": "Device Flow",
                "description": "Reassigns a user to a different team",
                "service": "Move to Team",
                "requiredFields": [
                    "teamId"
                ],
                "outputFields": [
                    "_id",
                    "teamId"
                ]
            }
        }
    ]
}
```
