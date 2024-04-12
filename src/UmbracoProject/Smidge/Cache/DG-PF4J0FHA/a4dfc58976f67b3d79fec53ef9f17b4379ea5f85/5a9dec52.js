(function(){"use strict";function udConnectLocalComponent(){function link(scope){scope.connectionOptions=[{name:"Use Visual Studio",detailsAlias:"vs",icon:"icon-infinity"},{name:"Connect with git",detailsAlias:"git",icon:"icon-forms-github"}];scope.visibleConnectionDetail="";scope.showConnectionDetails=function(type){scope.visibleConnectionDetail=type}}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/udconnectlocal/udconnectlocal.html",scope:{gitUrl:"@"},link:link}}angular.module("umbraco.deploy.components").directive("udConnectLocal",udConnectLocalComponent)})(),function(){"use strict";function udContentflowComponent(workspaceHelper,angularHelper,deployQueueService,deployService,deployConfiguration,deploySignalrService,deployHelper,notificationsService){function link(scope){function onInit(){scope.dashboardWorkspaces=angular.copy(scope.config.Workspaces);scope.resetDeploy();scope.showAddWorkspace&&workspaceHelper.addAddWorkspace(scope.dashboardWorkspaces);setCurrentWorkspace(scope.dashboardWorkspaces);deployService.feedbackMessageLevel().then(function(data){scope.feedbackMessageLevel=data.FeedbackMessageLevel;scope.isFeedbackMessageLevelSet=!0})}function setCurrentWorkspace(workspaces){angular.forEach(workspaces,function(workspace){workspace.Type===scope.config.CurrentWorkspaceType&&(workspace.Current=!0,workspace.Active=!0,scope.showWorkspaceInfo(workspace))})}function updateLog(event,sessionUpdatedArgs){deployService.isOurSession(sessionUpdatedArgs.sessionId)&&isContentTransfer(sessionUpdatedArgs.workItem)&&angularHelper.safeApply(scope,function(){var progress=sessionUpdatedArgs;scope.deploy.trace+=""+progress.sessionId.substr(0,8)+" - "+workStatus[progress.status]+", "+progress.percent+"%"+(progress.comment?" - <em>"+progress.comment+"<\/em>":"")+"<br />";progress.log&&(scope.deploy.trace+="<br />"+filterLog(progress.log)+"<br /><br />")})}function filterLog(log){return log=log.replace(/(?:\&)/g,"&amp;"),log=log.replace(/(?:\<)/g,"&lt;"),log=log.replace(/(?:\>)/g,"&gt;"),log=log.replace(/(?:\r\n|\r|\n)/g,"<br />"),log=log.replace(/(?:\t)/g,"  "),log=log.replace("-- EXCEPTION ---------------------------------------------------",'<span class="umb-deploy-debug-exception">-- EXCEPTION ---------------------------------------------------'),log.replace("----------------------------------------------------------------","----------------------------------------------------------------<\/span>")}function isContentTransfer(workItem){return workItem?workItem==="SourceDeployWorkItem":!0}var search;scope.config=deployConfiguration;scope.enableWorkItemLogging=!1;scope.feedbackMessageLevel="";scope.solvedMismatches=[];scope.isFeedbackMessageLevelSet=!1;var timestampFormat="MMMM Do YYYY, HH:mm:ss",serverTimestampFormat="YYYY-MM-DD HH:mm:ss,SSS",workStatus=["Unknown","New","Executing","Completed","Failed","Cancelled","TimedOut"];scope.$on("deploy:sessionUpdated",function(event,args){args.sessionId===deployService.sessionId&&isContentTransfer(args.workItem)&&angularHelper.safeApply(scope,function(){scope.deploy.deployProgress=args.percent;scope.deploy.currentActivity=args.comment;scope.deploy.status=deployHelper.getStatusValue(args.status);scope.deploy.timestamp=moment().format(timestampFormat);scope.deploy.serverTimestamp=moment(args.serverTimestamp).format(serverTimestampFormat);scope.deploy.status==="completed"?(deployQueueService.clearQueue(),deployService.removeSessionId()):scope.deploy.status==="mismatch"?scope.solvedMismatches=args.mismatchList:(scope.deploy.status==="failed"||scope.deploy.status==="cancelled"||scope.deploy.status==="timedOut")&&(scope.deploy.error={hasError:!0,comment:args.comment,log:args.log,exception:args.exception})})});scope.$on("deploy:heartbeat",function(event,args){deployService.isOurSession(args.sessionId)&&isContentTransfer(args.workItem)&&angularHelper.safeApply(scope,function(){scope.deploy&&(scope.deploy.timestamp=moment().format(timestampFormat),scope.deploy.serverTimestamp=moment(args.serverTimestamp).format(serverTimestampFormat))})});scope.$on("deploy:heartbeat",function(event,args){deployService.isOurSession(args.sessionId)&&isContentTransfer(args.workItem)&&angularHelper.safeApply(scope,function(){scope.deploy.trace+="❤<br />"})});scope.$on("deploy:sessionUpdated",updateLog);scope.$on("restore:sessionUpdated",updateLog);scope.resetDeploy=function(){deployQueueService.refreshQueue();scope.deploy={deployProgress:0,currentActivity:"",status:"",error:{},trace:"",showDebug:!1}};scope.selectWorkspace=function(selectedWorkspace,workspaces){workspaces&&angular.forEach(workspaces,function(workspace){workspace.Active=!1});scope.localWorkspace&&(scope.localWorkspace.Active=!1);selectedWorkspace&&(selectedWorkspace.Active=!0);scope.showWorkspaceInfo(selectedWorkspace)};scope.showWorkspaceInfo=function(workspace){scope.workspaceInfobox=workspace.Type==="inactive"?"addWorkspace":workspace.Type!=="local"||workspace.Current?workspace.Current&&scope.config.Target?"deploy":"info":"connect"};scope.getActiveWorkspace=function(){return workspaceHelper.getActiveWorkspace(scope.dashboardWorkspaces)};scope.addWorkspaceInPortal=function(projectUrl){workspaceHelper.addWorkspaceInPortal(projectUrl)};scope.onDeployStartSuccess=function(){scope.deploy.deployProgress=0;scope.deploy.currentActivity="Please wait...";scope.deploy.status=deployHelper.getStatusValue(2);scope.deploy.timestamp=moment().format(timestampFormat);scope.enableWorkItemLogging&&(scope.deploy.showDebug=!0)};scope.showDebug=function(){scope.deploy.showDebug=!scope.deploy.showDebug};scope.copyDebugToClipboard=function(){var trace=scope.deploy.trace;trace=trace.replace(/<br\s*\/?>/mg,"\n");trace=trace.replace(/<\/?[^>]+(>|$)/g,"");navigator.clipboard.writeText(trace);notificationsService.success("Technical details copied to clipboard.")};search=window.location.search;scope.enableWorkItemLogging=search==="?ddebug";onInit()}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/udcontentflow/udcontentflow.html",link:link,scope:{allowManageWorkspaces:"="}}}angular.module("umbraco.deploy.components").directive("udContentFlow",udContentflowComponent)}(),function(){"use strict";function udErrorComponent(){function link(scope){var e,udis;for(scope.errorDetailsVisible=!1,scope.toggleErrorDetails=function(){scope.errorDetailsVisible=!scope.errorDetailsVisible},e=scope.exception;e!=null;){if(e.HasMeaningForUi!=null){scope.innerException=e;break}if(e.Type!=null&&e.Type==="Umbraco.Deploy.Infrastructure.Exceptions.RemoteApiException"){e=e.Error;continue}else if(e.InnerException!=null){e=e.InnerException;continue}scope.innerException=e;break}for(e=scope.exception,udis=[];e!=null;)e.ExceptionType!=null&&e.ExceptionType==="Umbraco.Deploy.Infrastructure.Exceptions.RemoteApiException"?e=e.Error:(e.Udi&&udis.indexOf(e.Udi)<0&&udis.push(e.Udi),e=e.InnerException);scope.exceptionUdis=udis}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/uderror/uderror.html",scope:{exception:"=",comment:"=",log:"=",status:"=",onBack:"&?",onDebug:"&?",noNodes:"=",operation:"@operation",timestamp:"=",serverTimestamp:"=",showDebug:"=",isDebugInfo:"=",feedbackMessageLevel:"="},link:link}}angular.module("umbraco.deploy.components").directive("udError",udErrorComponent)}(),function(){"use strict";function udInfoboxComponent(){function link(){}return{restrict:"E",transclude:!0,replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/udinfobox/udinfobox.html",link:link}}angular.module("umbraco.deploy.components").directive("udInfobox",udInfoboxComponent)}(),function(){"use strict";function udDeployCompleteComponent(deployService){function link(scope){scope.isSchemaFiles=!1;scope.schemaFiles=[];scope.solvedMismatches!==undefined&&scope.solvedMismatches!==null&&(scope.solvedMismatches.forEach(function(mismatch){var schemaFile={Type:deployService.prettyEntityType(mismatch.Udi),Name:deployService.getViewName(mismatch.Name)};scope.schemaFiles.push(schemaFile)}),scope.schemaFiles.length>0&&(scope.isSchemaFiles=!0))}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/deploy/uddeploycomplete/uddeploycomplete.html",scope:{targetName:"=",targetUrl:"=",timestamp:"=",serverTimestamp:"=",onBack:"&",solvedMismatches:"="},link:link}}angular.module("umbraco.deploy.components").directive("udDeployComplete",udDeployCompleteComponent)}(),function(){"use strict";function udDeployProgressComponent(){function link(){}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/deploy/uddeployprogress/uddeployprogress.html",scope:{targetName:"=",progress:"=",currentActivity:"=",timestamp:"=",serverTimestamp:"="},link:link}}angular.module("umbraco.deploy.components").directive("udDeployProgress",udDeployProgressComponent)}(),function(){"use strict";function udDeployQueueComponent($q,deployQueueService,deployService,deployResource,deployHelper,overlayService,languageResource,userService,dateHelper){function link(scope){function init(){$q.all([deployResource.getEntityTypeToNameMap().then(function(data){entityTypeToNameMap=data.Map}),languageResource.getAll().then(function(data){languages=_.indexBy(data,"culture")}),userService.getCurrentUser().then(function(user){currentUser=user})]).then(function(){scope.items=deployQueueService.queue;scope.loading=!1})}function setItemDescription(items){angular.forEach(items,function(item){var descriptions=[];item.Culture&&item.Culture.length>0&&(item.Culture=="*"?descriptions.push("All languages"):languages[item.Culture]?descriptions.push("Language: "+languages[item.Culture].name):descriptions.push("Language: "+item.Culture));item.IncludeDescendants&&descriptions.push("Including all items below");item.ReleaseDate&&descriptions.push("Publish at: "+formatDateTime(item.ReleaseDate));item.Description=descriptions.join(" - ")})}function formatDateTime(date){return dateHelper.getLocalDate(date,currentUser.locale,"MMM Do YYYY, HH:mm")}var eventBindings=[];scope.loading=!0;var entityTypeToNameMap={},languages={},currentUser=null,timestampFormat="MMMM Do YYYY, HH:mm:ss";scope.deployButtonState="init";scope.deployInfo={doAutomaticSchemaTransfer:!1,isLocal:scope.isLocal,isDeveloper:deployService.isDeveloper(scope.userFeedbackLevel)};init();scope.startDeploy=function(){scope.deployButtonState="busy";deployService.deploy(scope.enableWorkItemLogging,scope.deployInfo).then(function(data){if(scope.onDeployStartSuccess)scope.onDeployStartSuccess({data:data});scope.deployButtonState="success"},function(error){error.ClassName=error.ExceptionType;scope.$parent.deploy.status="failed";scope.$parent.deploy.timestamp=moment().format(timestampFormat);scope.$parent.deploy.error={hasError:!0,comment:error.Message,exception:error};scope.deployButtonState="error"})};scope.clearQueue=function(){var overlay={view:"confirm",title:"Confirmation",content:"Are you sure you want to remove all items from the transfer queue?",closeButtonLabel:"No",submitButtonLabel:"Yes",submitButtonStyle:"danger",close:function(){overlayService.close()},submit:function(){deployQueueService.clearQueue();overlayService.close()}};overlayService.open(overlay)};scope.removeFromQueue=function(item){deployQueueService.removeFromQueue(item)};scope.refreshQueue=function(){deployQueueService.refreshQueue()};scope.toggleEntityTypeItems=function(items){items.showItems=!items.showItems};scope.getEntityName=function(entityType){return deployHelper.getEntityName(entityType,entityTypeToNameMap)};eventBindings.push(scope.$watch("items",function(){setItemDescription(scope.items)},!0));scope.$on("$destroy",function(){for(var e in eventBindings)eventBindings[e]()})}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/deploy/uddeployqueue/uddeployqueue.html",scope:{targetName:"=",targetUrl:"=",isLocal:"=",userFeedbackLevel:"=",enableWorkItemLogging:"=",onDeployStartSuccess:"&"},link:link}}angular.module("umbraco.deploy.components").directive("udDeployQueue",udDeployQueueComponent)}(),function(){"use strict";function udBusyErrorComponent(){function link(){}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/udbusyerror/udbusyerror.html",scope:{exception:"=",feedbackMessageLevel:"="},link:link}}angular.module("umbraco.deploy.components").directive("udBusyError",udBusyErrorComponent)}(),function(){"use strict";function udChunkDecodingErrorComponent(){function link(){}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/udchunkdecodingerror/udchunkdecodingerror.html",scope:{feedbackMessageLevel:"="},link:link}}angular.module("umbraco.deploy.components").directive("udChunkDecodingError",udChunkDecodingErrorComponent)}(),function(){"use strict";function udCollisionErrorComponent(){function link(){}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/udcollisionerror/udcollisionerror.html",scope:{exception:"=",exceptionUdis:"=",operation:"=",feedbackMessageLevel:"="},link:link}}angular.module("umbraco.deploy.components").directive("udCollisionError",udCollisionErrorComponent)}(),function(){"use strict";function udContentTypeChangedErrorComponent(){function link(){}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/udcontenttypechangederror/udcontenttypechangederror.html",scope:{exceptionUdis:"="},link:link}}angular.module("umbraco.deploy.components").directive("udContentTypeChangedError",udContentTypeChangedErrorComponent)}(),function(){"use strict";function udDependencyErrorComponent(){function link(){}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/uddepencencyerror/uddependencyerror.html",scope:{exception:"=",feedbackMessageLevel:"="},link:link}}angular.module("umbraco.deploy.components").directive("udDependencyError",udDependencyErrorComponent)}(),function(){"use strict";function udDeploySchemaMismatchErrorComponent(deployService){function link(scope){scope.prettyEntityType=function(udi){return deployService.prettyEntityType(udi)};var contentItems=[];angular.forEach(scope.exception.ContentNames,function(contentName){contentName===null||contentName===""||contentItems.includes(contentName)||contentItems.push(contentName)});scope.contentItems=contentItems}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/uddeployschemamismatcherror/uddeployschemamismatcherror.html",scope:{exception:"=",feedbackMessageLevel:"="},link:link}}angular.module("umbraco.deploy.components").directive("udDeploySchemaMismatchError",udDeploySchemaMismatchErrorComponent)}(),function(){"use strict";function udImportSchemaMismatchErrorComponent(deployService){function link(scope){scope.prettyEntityType=function(udi){return deployService.prettyEntityType(udi)}}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/udimportartifactserror/udimportartifactserror.html",scope:{exception:"=",feedbackMessageLevel:"="},link:link}}angular.module("umbraco.deploy.components").directive("udImportArtifactsError",udImportSchemaMismatchErrorComponent)}();angular.module("umbraco.deploy.components").directive("udImportArtifactsUnhandledError",function(){return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/udimportartifactsunhandlederror/udimportartifactsunhandlederror.html",scope:{exception:"=",feedbackMessageLevel:"="}}}),function(){"use strict";function udInvalidPathErrorComponent(){function link(){}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/udinvalidpatherror/udinvalidpatherror.html",scope:{feedbackMessageLevel:"=",exceptionUdis:"="},link:link}}angular.module("umbraco.deploy.components").directive("udInvalidPathError",udInvalidPathErrorComponent)}(),function(){"use strict";function udKabumErrorComponent(){function link(){}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/udkabumerror/udkabumerror.html",scope:{exception:"=",exceptionUdis:"="},link:link}}angular.module("umbraco.deploy.components").directive("udKabumError",udKabumErrorComponent)}(),function(){"use strict";function udMergeConflictErrorComponent(){function link(){}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/udmergeconflicterror/udmergeconflicterror.html",scope:{exception:"=",feedbackMessageLevel:"="},link:link}}angular.module("umbraco.deploy.components").directive("udMergeConflictError",udMergeConflictErrorComponent)}(),function(){"use strict";function udRemoteApiTimeoutErrorComponent(){function link(){}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/udremoteapitimeouterror/udremoteapitimeouterror.html",scope:{exception:"=",feedbackMessageLevel:"="},link:link}}angular.module("umbraco.deploy.components").directive("udRemoteApiTimeoutError",udRemoteApiTimeoutErrorComponent)}(),function(){"use strict";function udRestoreSchemaMismatchErrorComponent(){function link(scope){scope.prettyEntityType=function(udi){var p1=udi.indexOf("//"),p2=udi.indexOf("/",p1+2),n=udi.substr(p1+2,p2-p1-2);return n=n.replace("-"," "),n.substr(0,1).toUpperCase()+n.substr(1)}}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/udrestoreschemamismatcherror/udrestoreschemamismatcherror.html",scope:{exception:"=",noNodes:"=",feedbackMessageLevel:"="},link:link}}angular.module("umbraco.deploy.components").directive("udRestoreSchemaMismatchError",udRestoreSchemaMismatchErrorComponent)}(),function(){"use strict";function udUnauthorizedClientErrorComponent(){function link(){}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/udunauthorizedclienterror/udunauthorizedclienterror.html",scope:{},link:link}}angular.module("umbraco.deploy.components").directive("udUnauthorizedClientError",udUnauthorizedClientErrorComponent)}(),function(){"use strict";function udWebExceptionErrorComponent(){function link(){}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/errors/udwebexceptionerror/udwebexceptionerror.html",scope:{exception:"=",feedbackMessageLevel:"="},link:link}}angular.module("umbraco.deploy.components").directive("udWebExceptionError",udWebExceptionErrorComponent)}(),function(){"use strict";function udExportCompleteComponent(){return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/export/udexportcomplete/udexportcomplete.html",scope:{onDownload:"&",onDelete:"&",timestamp:"=",downloadButtonState:"="}}}angular.module("umbraco.deploy.components").directive("udExportComplete",udExportCompleteComponent)}(),function(){"use strict";function udExportProgressComponent(){return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/export/udexportprogress/udexportprogress.html",scope:{progress:"=",currentActivity:"=",timestamp:"=",serverTimestamp:"="}}}angular.module("umbraco.deploy.components").directive("udExportProgress",udExportProgressComponent)}(),function(){"use strict";function udImportCompleteComponent(){return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/import/udimportcomplete/udimportcomplete.html",scope:{timestamp:"=",serverTimestamp:"="}}}angular.module("umbraco.deploy.components").directive("udImportComplete",udImportCompleteComponent)}(),function(){"use strict";function udImportProgressComponent(){return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/import/udimportprogress/udimportprogress.html",scope:{progress:"=",currentActivity:"=",timestamp:"=",serverTimestamp:"="}}}angular.module("umbraco.deploy.components").directive("udImportProgress",udImportProgressComponent)}(),function(){"use strict";function udRestoreCompleteComponent(){return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/restore/udrestorecomplete/udrestorecomplete.html",scope:{onBack:"&",timestamp:"=",serverTimestamp:"="}}}angular.module("umbraco.deploy.components").directive("udRestoreComplete",udRestoreCompleteComponent)}(),function(){"use strict";function udRestoreProgressComponent(){return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/restore/udrestoreprogress/udrestoreprogress.html",scope:{targetName:"=",progress:"=",currentActivity:"=",timestamp:"=",serverTimestamp:"="}}}angular.module("umbraco.deploy.components").directive("udRestoreProgress",udRestoreProgressComponent)}(),function(){"use strict";function udWorkspaceComponent(){function link(){}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/workspace/udworkspace/udworkspace.html",scope:{name:"=",type:"=",current:"=",active:"=",isLast:"=",deployProgress:"=",showDetailsArrow:"=",onClick:"&"},link:link}}angular.module("umbraco.deploy.components").directive("udWorkspace",udWorkspaceComponent)}(),function(){"use strict";function udWorkspaceAddComponent(){function link(){}return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/workspace/udworkspaceadd/udworkspaceadd.html",scope:{onAddWorkspace:"&"},link:link}}angular.module("umbraco.deploy.components").directive("udWorkspaceAdd",udWorkspaceAddComponent)}(),function(){"use strict";function udWorkspaceInfoComponent(){return{restrict:"E",replace:!0,templateUrl:"/App_Plugins/Deploy/views/components/workspace/udworkspaceinfo/udworkspaceinfo.html",scope:{websiteUrl:"@",umbracoUrl:"@",projectUrl:"@",projectName:"@",allowManageWorkspaces:"="}}}angular.module("umbraco.deploy.components").directive("udWorkspaceInfo",udWorkspaceInfoComponent)}()