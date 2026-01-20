
```
sotemp
├─ my_tables_data.sql
├─ my_tables_ddl.sql
├─ pnpm buildspring.txt
├─ study
│  ├─ auth서버 로그인창 접근 후 버튼클릭시 401에러.txt
│  ├─ 토큰이 필요한 요청구분.txt
│  └─ 토큰필터동작.txt
├─ temp
│  ├─ .editorconfig
│  ├─ .factorypath
│  ├─ app-api
│  │  ├─ .editorconfig
│  │  ├─ .factorypath
│  │  ├─ build.gradle
│  │  ├─ src
│  │  │  └─ main
│  │  │     ├─ java
│  │  │     │  └─ kr
│  │  │     │     └─ co
│  │  │     │        └─ koreazinc
│  │  │     │           └─ app
│  │  │     │              ├─ authentication
│  │  │     │              │  ├─ AuthorizationAccessChecker.java
│  │  │     │              │  └─ TokenAuthenticationProvider.java
│  │  │     │              ├─ configuration
│  │  │     │              │  ├─ SwaggerConfig.java
│  │  │     │              │  ├─ WebConfig.java
│  │  │     │              │  └─ WebSecurityConfig.java
│  │  │     │              ├─ controller
│  │  │     │              │  ├─ IndexController.java
│  │  │     │              │  └─ v1
│  │  │     │              │     ├─ account
│  │  │     │              │     │  └─ AccountController.java
│  │  │     │              │     ├─ IndexController.java
│  │  │     │              │     └─ notice
│  │  │     │              │        ├─ MasterDataController.java
│  │  │     │              │        └─ NoticeController.java
│  │  │     │              ├─ dto
│  │  │     │              │  └─ notice
│  │  │     │              │     ├─ ApiResponse.java
│  │  │     │              │     ├─ NoticeRegistrationDto.java
│  │  │     │              │     └─ NoticeResponseDto.java
│  │  │     │              ├─ MainApplication.java
│  │  │     │              ├─ model
│  │  │     │              │  ├─ account
│  │  │     │              │  │  ├─ AccountDto.java
│  │  │     │              │  │  └─ view
│  │  │     │              │  │     └─ VAccountDto.java
│  │  │     │              │  └─ security
│  │  │     │              │     └─ UserDetailsImpl.java
│  │  │     │              └─ service
│  │  │     │                 ├─ account
│  │  │     │                 │  └─ AccountService.java
│  │  │     │                 ├─ notice
│  │  │     │                 │  └─ NoticeService.java
│  │  │     │                 └─ security
│  │  │     │                    └─ UserDetailsServiceImpl.java
│  │  │     └─ resources
│  │  │        ├─ config
│  │  │        │  ├─ application-dev.yaml
│  │  │        │  ├─ application-local.yaml
│  │  │        │  ├─ application-prod.yaml
│  │  │        │  └─ application.yaml
│  │  │        ├─ messages
│  │  │        │  ├─ messages.properties
│  │  │        │  ├─ messages_en.properties
│  │  │        │  └─ messages_ko.properties
│  │  │        ├─ META-INF
│  │  │        │  └─ additional-spring-configuration-metadata.json
│  │  │        └─ static
│  │  │           ├─ assets
│  │  │           │  ├─ index-BjhqJi6A.css
│  │  │           │  └─ index-CMNwrNtk.js
│  │  │           ├─ index.html
│  │  │           └─ vite.svg
│  │  └─ work
│  │     └─ Tomcat
│  │        └─ localhost
│  │           └─ ROOT
│  ├─ build.gradle
│  ├─ cloud-actuator
│  │  ├─ .editorconfig
│  │  ├─ .factorypath
│  │  ├─ build.gradle
│  │  └─ src
│  │     └─ main
│  │        ├─ java
│  │        │  └─ kr
│  │        │     └─ co
│  │        │        └─ koreazinc
│  │        │           └─ actuator
│  │        │              ├─ configuration
│  │        │              │  ├─ HealthConfig.java
│  │        │              │  ├─ ObservationConfiguration.java
│  │        │              │  └─ PyroscopeConfig.java
│  │        │              ├─ health
│  │        │              │  ├─ HealthProperties.java
│  │        │              │  ├─ ServerComposite.java
│  │        │              │  └─ ServerHealthIndicator.java
│  │        │              └─ profile
│  │        │                 └─ PyroscopeProperties.java
│  │        └─ resources
│  │           ├─ config
│  │           │  ├─ custom-cloud-actuator-dev.yaml
│  │           │  ├─ custom-cloud-actuator-local.yaml
│  │           │  ├─ custom-cloud-actuator-prod.yaml
│  │           │  └─ custom-cloud-actuator-test.yaml
│  │           ├─ logback
│  │           │  └─ appender-loki.xml
│  │           ├─ logback-spring-actuator.xml
│  │           └─ META-INF
│  │              └─ additional-spring-configuration-metadata.json
│  ├─ cloud-discovery
│  │  ├─ .editorconfig
│  │  ├─ .factorypath
│  │  ├─ build.gradle
│  │  └─ src
│  │     └─ main
│  │        └─ resources
│  │           └─ config
│  │              ├─ custom-cloud-discovery-dev.yaml
│  │              ├─ custom-cloud-discovery-local.yaml
│  │              ├─ custom-cloud-discovery-prod.yaml
│  │              └─ custom-cloud-discovery-test.yaml
│  ├─ cloud-doc
│  │  ├─ .editorconfig
│  │  ├─ .factorypath
│  │  ├─ build.gradle
│  │  └─ src
│  │     └─ main
│  │        ├─ java
│  │        │  └─ kr
│  │        │     └─ co
│  │        │        └─ koreazinc
│  │        │           └─ doc
│  │        │              ├─ configuration
│  │        │              │  ├─ GlobalDocumentConfig.java
│  │        │              │  └─ GlobalSwaggerConfig.java
│  │        │              └─ v3
│  │        │                 ├─ converter
│  │        │                 │  └─ EnumValueConverter.java
│  │        │                 ├─ customizers
│  │        │                 │  ├─ CustomGlobalOpenApiCustomizer.java
│  │        │                 │  └─ CustomOperationCustomizer.java
│  │        │                 ├─ model
│  │        │                 │  └─ components
│  │        │                 ├─ models
│  │        │                 │  ├─ annotations
│  │        │                 │  │  └─ Customizing.java
│  │        │                 │  ├─ callbacks
│  │        │                 │  │  └─ Callback.java
│  │        │                 │  ├─ Components.java
│  │        │                 │  ├─ examples
│  │        │                 │  │  └─ Example.java
│  │        │                 │  ├─ ExternalDocumentation.java
│  │        │                 │  ├─ headers
│  │        │                 │  │  └─ Header.java
│  │        │                 │  ├─ info
│  │        │                 │  │  ├─ Contact.java
│  │        │                 │  │  ├─ Info.java
│  │        │                 │  │  └─ License.java
│  │        │                 │  ├─ links
│  │        │                 │  │  └─ Link.java
│  │        │                 │  ├─ media
│  │        │                 │  │  ├─ Content.java
│  │        │                 │  │  ├─ Encoding.java
│  │        │                 │  │  ├─ MediaType.java
│  │        │                 │  │  └─ Schema.java
│  │        │                 │  ├─ OpenAPI.java
│  │        │                 │  ├─ Operation.java
│  │        │                 │  ├─ parameters
│  │        │                 │  │  ├─ Parameter.java
│  │        │                 │  │  └─ RequestBody.java
│  │        │                 │  ├─ PathItem.java
│  │        │                 │  ├─ Paths.java
│  │        │                 │  ├─ responses
│  │        │                 │  │  ├─ ApiResponse.java
│  │        │                 │  │  └─ ApiResponses.java
│  │        │                 │  ├─ security
│  │        │                 │  │  ├─ OAuthFlow.java
│  │        │                 │  │  ├─ OAuthFlows.java
│  │        │                 │  │  ├─ Scopes.java
│  │        │                 │  │  ├─ SecurityRequirement.java
│  │        │                 │  │  └─ SecurityScheme.java
│  │        │                 │  ├─ servers
│  │        │                 │  │  ├─ Server.java
│  │        │                 │  │  ├─ ServerVariable.java
│  │        │                 │  │  └─ ServerVariables.java
│  │        │                 │  └─ tags
│  │        │                 │     └─ Tag.java
│  │        │                 ├─ support
│  │        │                 │  └─ Extensions.java
│  │        │                 └─ utils
│  │        │                    └─ SpecificationMapper.java
│  │        └─ resources
│  │           └─ config
│  │              ├─ custom-cloud-doc-dev.yaml
│  │              ├─ custom-cloud-doc-local.yaml
│  │              ├─ custom-cloud-doc-prod.yaml
│  │              └─ custom-cloud-doc-test.yaml
│  ├─ cloud-tomcat
│  │  ├─ .editorconfig
│  │  ├─ .factorypath
│  │  ├─ build.gradle
│  │  └─ src
│  │     └─ main
│  │        ├─ java
│  │        │  └─ kr
│  │        │     └─ co
│  │        │        └─ koreazinc
│  │        │           └─ tomcat
│  │        │              ├─ configuration
│  │        │              │  └─ TomcatAutoConfig.java
│  │        │              ├─ embedded
│  │        │              │  ├─ CustomConnector.java
│  │        │              │  ├─ CustomRequest.java
│  │        │              │  └─ CustomServerFactory.java
│  │        │              └─ property
│  │        │                 └─ ApjProperty.java
│  │        └─ resources
│  │           ├─ config
│  │           │  ├─ custom-cloud-tomcat-dev.yaml
│  │           │  ├─ custom-cloud-tomcat-local.yaml
│  │           │  ├─ custom-cloud-tomcat-prod.yaml
│  │           │  └─ custom-cloud-tomcat-test.yaml
│  │           └─ META-INF
│  │              └─ additional-spring-configuration-metadata.json
│  ├─ data-core
│  │  ├─ .editorconfig
│  │  ├─ .factorypath
│  │  ├─ build.gradle
│  │  └─ src
│  │     ├─ main
│  │     │  ├─ java
│  │     │  │  └─ kr
│  │     │  │     └─ co
│  │     │  │        └─ koreazinc
│  │     │  │           └─ data
│  │     │  │              ├─ configuration
│  │     │  │              │  └─ TransactionConfig.java
│  │     │  │              ├─ function
│  │     │  │              │  └─ SQLServerFunction.java
│  │     │  │              ├─ functional
│  │     │  │              │  └─ NativeFormer.java
│  │     │  │              ├─ listeners
│  │     │  │              │  └─ HistoryListener.java
│  │     │  │              ├─ model
│  │     │  │              │  ├─ attribute
│  │     │  │              │  │  ├─ BaseEnum.java
│  │     │  │              │  │  ├─ converter
│  │     │  │              │  │  │  ├─ AesEncryptConverter.java
│  │     │  │              │  │  │  ├─ BaseEnumConverter.java
│  │     │  │              │  │  │  ├─ HttpMethodConverter.java
│  │     │  │              │  │  │  ├─ HttpStatusConverter.java
│  │     │  │              │  │  │  ├─ LanguageConverter.java
│  │     │  │              │  │  │  ├─ Sha256Converter.java
│  │     │  │              │  │  │  └─ YnConverter.java
│  │     │  │              │  │  └─ enumeration
│  │     │  │              │  │     ├─ Language.java
│  │     │  │              │  │     └─ Yn.java
│  │     │  │              │  ├─ converter
│  │     │  │              │  │  └─ EntityConverter.java
│  │     │  │              │  ├─ embedded
│  │     │  │              │  │  ├─ history
│  │     │  │              │  │  │  ├─ IntegerModif.java
│  │     │  │              │  │  │  ├─ StringModif.java
│  │     │  │              │  │  │  └─ UUIDModif.java
│  │     │  │              │  │  └─ piece
│  │     │  │              │  │     ├─ I18N.java
│  │     │  │              │  │     └─ Use.java
│  │     │  │              │  └─ listeners
│  │     │  │              │     └─ UUIDGenerationListener.java
│  │     │  │              ├─ repository
│  │     │  │              │  ├─ AbstractJpaRepository.java
│  │     │  │              │  └─ BaseEnumRepository.java
│  │     │  │              ├─ strategy
│  │     │  │              │  └─ physical
│  │     │  │              │     ├─ CamelCaseToLowerUnderscoresNamingStrategy.java
│  │     │  │              │     ├─ CamelCaseToUpperUnderscoresNamingStrategy.java
│  │     │  │              │     └─ NaturalNamingStrategy.java
│  │     │  │              ├─ support
│  │     │  │              │  ├─ attribute
│  │     │  │              │  │  ├─ ConverterFactory.java
│  │     │  │              │  │  ├─ EncryptConverter.java
│  │     │  │              │  │  ├─ EnumConverter.java
│  │     │  │              │  │  └─ ObjectConverter.java
│  │     │  │              │  ├─ DataType.java
│  │     │  │              │  ├─ embedded
│  │     │  │              │  │  └─ Modif.java
│  │     │  │              │  ├─ mapped
│  │     │  │              │  │  └─ History.java
│  │     │  │              │  └─ Query.java
│  │     │  │              ├─ types
│  │     │  │              │  ├─ Condition.java
│  │     │  │              │  ├─ Filter.java
│  │     │  │              │  ├─ FilterExpression.java
│  │     │  │              │  ├─ FilterOperator.java
│  │     │  │              │  ├─ operator
│  │     │  │              │  │  ├─ DateOperator.java
│  │     │  │              │  │  ├─ DateTimeOperator.java
│  │     │  │              │  │  ├─ EnumOperator.java
│  │     │  │              │  │  ├─ LogicalOperator.java
│  │     │  │              │  │  ├─ NumberOperator.java
│  │     │  │              │  │  ├─ ObjectOperator.java
│  │     │  │              │  │  └─ StringOperator.java
│  │     │  │              │  └─ Sort.java
│  │     │  │              └─ utils
│  │     │  │                 └─ DevExtremeUtils.java
│  │     │  └─ resources
│  │     │     ├─ config
│  │     │     │  ├─ custom-data-core-dev.yaml
│  │     │     │  ├─ custom-data-core-local.yaml
│  │     │     │  ├─ custom-data-core-prod.yaml
│  │     │     │  └─ custom-data-core-test.yaml
│  │     │     └─ META-INF
│  │     │        └─ additional-spring-configuration-metadata.json
│  │     └─ test
│  │        └─ java
│  │           └─ kr
│  │              └─ co
│  │                 └─ koreazinc
│  │                    └─ domain
│  │                       └─ MainApplication.java
│  ├─ data-temp
│  │  ├─ .editorconfig
│  │  ├─ .factorypath
│  │  ├─ build.gradle
│  │  └─ src
│  │     └─ main
│  │        ├─ java
│  │        │  └─ kr
│  │        │     └─ co
│  │        │        └─ koreazinc
│  │        │           └─ temp
│  │        │              ├─ configuration
│  │        │              │  ├─ CustomDialect.java
│  │        │              │  ├─ DataSourceConfig.java
│  │        │              │  └─ QuerydslConfig.java
│  │        │              ├─ model
│  │        │              │  ├─ attribute
│  │        │              │  │  ├─ converter
│  │        │              │  │  │  ├─ EnumValuesConverter.java
│  │        │              │  │  │  ├─ IndexTypeConverter.java
│  │        │              │  │  │  ├─ LinkTypeConverter.java
│  │        │              │  │  │  ├─ MappingTypeConverter.java
│  │        │              │  │  │  ├─ MenuCategoryConverter.java
│  │        │              │  │  │  ├─ MenuTypeConverter.java
│  │        │              │  │  │  ├─ NotifyCategoryConverter.java
│  │        │              │  │  │  ├─ NotifyLevelConverter.java
│  │        │              │  │  │  ├─ NotifyStatusConverter.java
│  │        │              │  │  │  ├─ ParameterCategoryConverter.java
│  │        │              │  │  │  ├─ RequiredValuesConverter.java
│  │        │              │  │  │  ├─ SchemaTypeConverter.java
│  │        │              │  │  │  ├─ SecurityCategoryConverter.java
│  │        │              │  │  │  ├─ SecurityFlowTypeConverter.java
│  │        │              │  │  │  ├─ SecurityScopeConverter.java
│  │        │              │  │  │  ├─ SecurityScopesConverter.java
│  │        │              │  │  │  └─ SecurityTypeConverter.java
│  │        │              │  │  └─ enumeration
│  │        │              │  │     ├─ EnumValues.java
│  │        │              │  │     ├─ IndexType.java
│  │        │              │  │     ├─ LinkType.java
│  │        │              │  │     ├─ MappingType.java
│  │        │              │  │     ├─ MenuCategory.java
│  │        │              │  │     ├─ MenuType.java
│  │        │              │  │     ├─ NotifyCategory.java
│  │        │              │  │     ├─ NotifyLevel.java
│  │        │              │  │     ├─ NotifyStatus.java
│  │        │              │  │     ├─ ParameterCategory.java
│  │        │              │  │     ├─ RequiredValues.java
│  │        │              │  │     ├─ SchemaType.java
│  │        │              │  │     ├─ SecurityCategory.java
│  │        │              │  │     ├─ SecurityFlowType.java
│  │        │              │  │     ├─ SecurityScope.java
│  │        │              │  │     ├─ SecurityScopes.java
│  │        │              │  │     └─ SecurityType.java
│  │        │              │  ├─ converter
│  │        │              │  │  └─ account
│  │        │              │  │     └─ AccountConverter.java
│  │        │              │  └─ entity
│  │        │              │     ├─ account
│  │        │              │     │  ├─ Account.java
│  │        │              │     │  └─ view
│  │        │              │     │     └─ VAccount.java
│  │        │              │     └─ notice
│  │        │              │        ├─ CorporationMaster.java
│  │        │              │        ├─ NoticeBase.java
│  │        │              │        ├─ NoticeTag.java
│  │        │              │        ├─ NoticeTarget.java
│  │        │              │        ├─ OrganizationMaster.java
│  │        │              │        ├─ ServiceMaster.java
│  │        │              │        └─ UserMaster.java
│  │        │              └─ repository
│  │        │                 ├─ account
│  │        │                 │  ├─ AccountRepository.java
│  │        │                 │  └─ view
│  │        │                 │     └─ VAccountRepository.java
│  │        │                 └─ notice
│  │        │                    ├─ CorporationMasterRepository.java
│  │        │                    ├─ NoticeBaseRepository.java
│  │        │                    ├─ NoticeTargetRepository.java
│  │        │                    ├─ OrganizationMasterRepository.java
│  │        │                    └─ ServiceMasterRepository.java
│  │        └─ resources
│  │           └─ config
│  │              ├─ custom-domain-temp-dev.yaml
│  │              ├─ custom-domain-temp-local.yaml
│  │              ├─ custom-domain-temp-prod.yaml
│  │              └─ custom-domain-temp-test.yaml
│  ├─ gradle
│  │  └─ wrapper
│  │     ├─ gradle-wrapper.jar
│  │     └─ gradle-wrapper.properties
│  ├─ gradlew
│  ├─ gradlew.bat
│  ├─ react-app
│  │  ├─ eslint.config.js
│  │  ├─ index.html
│  │  ├─ package.json
│  │  ├─ pnpm-lock.yaml
│  │  ├─ public
│  │  │  └─ vite.svg
│  │  ├─ README.md
│  │  ├─ src
│  │  │  ├─ api
│  │  │  │  └─ notices.js
│  │  │  ├─ App.css
│  │  │  ├─ App.jsx
│  │  │  ├─ assets
│  │  │  │  └─ react.svg
│  │  │  ├─ auth
│  │  │  │  ├─ authConfig.js
│  │  │  │  └─ session.js
│  │  │  ├─ components
│  │  │  │  ├─ AppHeader.css
│  │  │  │  └─ AppHeader.jsx
│  │  │  ├─ config
│  │  │  │  ├─ api.js
│  │  │  │  └─ apiConfig.js
│  │  │  ├─ index.css
│  │  │  ├─ layouts
│  │  │  │  └─ AppLayout.jsx
│  │  │  ├─ main.jsx
│  │  │  ├─ pages
│  │  │  │  ├─ AutoLogin.jsx
│  │  │  │  ├─ Login.css
│  │  │  │  ├─ Login.jsx
│  │  │  │  ├─ NoticeApproval.css
│  │  │  │  ├─ NoticeApproval.jsx
│  │  │  │  ├─ NoticeDashboard.css
│  │  │  │  ├─ NoticeDashboard.jsx
│  │  │  │  ├─ NoticeHistory.css
│  │  │  │  ├─ NoticeHistory.jsx
│  │  │  │  ├─ NoticeRegistration.css
│  │  │  │  ├─ NoticeRegistration.jsx
│  │  │  │  └─ SSORedirect.jsx
│  │  │  ├─ routes
│  │  │  │  └─ RequireAuth.jsx
│  │  │  └─ utils
│  │  │     └─ apiClient.js
│  │  ├─ temp
│  │  │  ├─ app-api
│  │  │  │  └─ src
│  │  │  │     └─ main
│  │  │  │        └─ resources
│  │  │  │           └─ static
│  │  │  │              ├─ assets
│  │  │  │              │  ├─ index-D1yzNEM-.css
│  │  │  │              │  └─ index-DD8e6dqw.js
│  │  │  │              ├─ index.html
│  │  │  │              └─ vite.svg
│  │  │  └─ data-temp
│  │  │     └─ src
│  │  │        └─ main
│  │  │           └─ java
│  │  │              └─ kr
│  │  │                 └─ co
│  │  │                    └─ koreazinc
│  │  │                       └─ temp
│  │  │                          └─ model
│  │  │                             └─ entity
│  │  │                                └─ notice
│  │  └─ vite.config.js
│  ├─ README.md
│  ├─ settings.gradle
│  └─ spring-core
│     ├─ .editorconfig
│     ├─ .factorypath
│     ├─ build.gradle
│     └─ src
│        └─ main
│           ├─ java
│           │  └─ kr
│           │     └─ co
│           │        └─ koreazinc
│           │           └─ spring
│           │              ├─ advice
│           │              │  ├─ GlobalExceptionAdvice.java
│           │              │  └─ GlobalRestExceptionAdvice.java
│           │              ├─ ApplicationContextHolder.java
│           │              ├─ configuration
│           │              │  ├─ GlobalWebConfig.java
│           │              │  ├─ JacksonConfig.java
│           │              │  └─ MessageConfig.java
│           │              ├─ controller
│           │              │  └─ ErrorController.java
│           │              ├─ convert
│           │              │  ├─ AbstractConverter.java
│           │              │  └─ converter
│           │              │     ├─ HttpStatusConverter.java
│           │              │     ├─ StringConverter.java
│           │              │     └─ UUIDConverter.java
│           │              ├─ CustomBeanNameGenerator.java
│           │              ├─ CustomResourceBundleMessageSource.java
│           │              ├─ CustomYamlPropertiesInitializer.java
│           │              ├─ exception
│           │              │  ├─ JwtIssuanceException.java
│           │              │  ├─ NotValidException.java
│           │              │  └─ TokenIssuanceException.java
│           │              ├─ filter
│           │              │  ├─ AttributeContextFilter.java
│           │              │  ├─ GlobalExceptionFilter.java
│           │              │  └─ RequestDecoratingFilter.java
│           │              ├─ http
│           │              │  ├─ codec
│           │              │  │  ├─ Jackson2XmlDecoder.java
│           │              │  │  └─ Jackson2XmlEncoder.java
│           │              │  ├─ enhancer
│           │              │  │  └─ HttpEnhancer.java
│           │              │  ├─ functional
│           │              │  │  └─ HttpFunction.java
│           │              │  ├─ matcher
│           │              │  │  ├─ DomainRequestMatcher.java
│           │              │  │  └─ PrefixPathRequestMatcher.java
│           │              │  ├─ RequestWrapper.java
│           │              │  ├─ util
│           │              │  │  ├─ ErrorResponse.java
│           │              │  │  └─ PageResponse.java
│           │              │  └─ utility
│           │              │     ├─ HttpUtils.java
│           │              │     └─ UriUtils.java
│           │              ├─ jackson
│           │              │  ├─ deserializer
│           │              │  └─ serializer
│           │              │     └─ HttpMethodSerializer.java
│           │              ├─ model
│           │              │  ├─ FileInfo.java
│           │              │  └─ MailInfo.java
│           │              ├─ property
│           │              │  ├─ PathProperty.java
│           │              │  └─ SpringProperty.java
│           │              ├─ security
│           │              │  ├─ adapter
│           │              │  │  ├─ CoreSecurityConfigurerAdapter.java
│           │              │  │  └─ SecurityProperties.java
│           │              │  ├─ authentication
│           │              │  │  ├─ AuthenticationManagerImpl.java
│           │              │  │  ├─ AuthorizationCodeAuthenticationProvider.java
│           │              │  │  ├─ AuthorizationCodeAuthenticationToken.java
│           │              │  │  ├─ CookieAuthenticationToken.java
│           │              │  │  ├─ OAuthAuthenticationProvider.java
│           │              │  │  ├─ OAuthAuthenticationToken.java
│           │              │  │  ├─ PassportAuthenticationToken.java
│           │              │  │  ├─ PasswordAuthenticationProvider.java
│           │              │  │  ├─ PasswordAuthenticationToken.java
│           │              │  │  └─ TokenAuthenticationToken.java
│           │              │  ├─ authorization
│           │              │  │  ├─ BasicAccessDeniedHandler.java
│           │              │  │  └─ BasicAuthenticationEntryPoint.java
│           │              │  ├─ exception
│           │              │  │  └─ UserJoinFailedException.java
│           │              │  ├─ filter
│           │              │  │  ├─ AuthorizationCodeAuthenticationFilter.java
│           │              │  │  ├─ CookieAuthenticationFilter.java
│           │              │  │  ├─ OAuthAuthenticationFilter.java
│           │              │  │  ├─ PasswordAuthenticationFilter.java
│           │              │  │  └─ TokenAuthenticationFilter.java
│           │              │  ├─ functional
│           │              │  │  ├─ ClearToken.java
│           │              │  │  ├─ GetCookie.java
│           │              │  │  └─ GetToken.java
│           │              │  ├─ model
│           │              │  │  ├─ ResponseToken.java
│           │              │  │  └─ UserInfo.java
│           │              │  ├─ property
│           │              │  │  └─ OAuth2Property.java
│           │              │  ├─ service
│           │              │  │  └─ ExpandUserDetailsService.java
│           │              │  └─ utility
│           │              │     ├─ AuthenticationCookieUtils.java
│           │              │     └─ AuthenticationTokenUtils.java
│           │              ├─ support
│           │              │  └─ SuppressWarning.java
│           │              ├─ util
│           │              │  ├─ CommonMap.java
│           │              │  ├─ Device.java
│           │              │  ├─ OAuth.java
│           │              │  ├─ time
│           │              │  │  └─ DateTimeFormat.java
│           │              │  └─ validation
│           │              │     └─ ValidList.java
│           │              ├─ utility
│           │              │  ├─ FileUtils.java
│           │              │  ├─ JwtUtils.java
│           │              │  ├─ MailUtils.java
│           │              │  ├─ MessageUtils.java
│           │              │  ├─ OAuthUtils.java
│           │              │  └─ PropertyUtils.java
│           │              └─ web
│           │                 ├─ reactive
│           │                 │  ├─ exception
│           │                 │  │  └─ NotFoundException.java
│           │                 │  ├─ HandlerInterceptor.java
│           │                 │  └─ i18n
│           │                 │     ├─ AbstractLocaleContextResolver.java
│           │                 │     ├─ AbstractLocaleResolver.java
│           │                 │     ├─ CookieLocaleResolver.java
│           │                 │     └─ LocaleChangeInterceptor.java
│           │                 └─ servlet
│           │                    ├─ context
│           │                    │  ├─ ContextHolder.java
│           │                    │  ├─ ContextResolver.java
│           │                    │  ├─ DomainContext.java
│           │                    │  ├─ DomainContextMatcher.java
│           │                    │  └─ DomainContextResolver.java
│           │                    ├─ exception
│           │                    │  └─ NotFoundException.java
│           │                    └─ result
│           │                       └─ view
│           │                          ├─ DefaultModelingBuilder.java
│           │                          ├─ Modeling.java
│           │                          └─ RedirectModel.java
│           └─ resources
│              ├─ banner.txt
│              ├─ config
│              │  ├─ custom-spring-core-dev.yaml
│              │  ├─ custom-spring-core-local.yaml
│              │  ├─ custom-spring-core-prod.yaml
│              │  └─ custom-spring-core-test.yaml
│              ├─ favicon.ico
│              ├─ logback
│              │  ├─ appender-console.xml
│              │  ├─ appender-file.xml
│              │  ├─ common.xml
│              │  ├─ logger-dev.xml
│              │  ├─ logger-local.xml
│              │  └─ logger-prod.xml
│              ├─ logback-spring.xml
│              ├─ messages
│              │  ├─ core-messages.properties
│              │  ├─ core-messages_en.properties
│              │  └─ core-messages_ko.properties
│              ├─ META-INF
│              │  ├─ additional-spring-configuration-metadata.json
│              │  └─ spring.factories
│              ├─ robots.txt
│              ├─ security
│              │  ├─ openssl.txt
│              │  ├─ private.der
│              │  ├─ private.key
│              │  ├─ public.der
│              │  └─ public.pem
│              └─ templates
│                 └─ error.html
├─ temp-migration
│  ├─ controllers
│  ├─ dtos
│  ├─ entities
│  ├─ repositories
│  └─ services
├─ tree.md
└─ 이슈발생사항
   └─ XSS보안이슈.txt

```