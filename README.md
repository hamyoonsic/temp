
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
```
sotemp
├─ my_tables_data.sql
├─ my_tables_ddl.sql
├─ pnpm buildspring.txt
├─ README.md
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
│  │  │     │              │        ├─ DashboardController.java
│  │  │     │              │        ├─ MasterDataController.java
│  │  │     │              │        └─ NoticeController.java
│  │  │     │              ├─ dto
│  │  │     │              │  └─ notice
│  │  │     │              │     ├─ ApiResponse.java
│  │  │     │              │     ├─ dashboard
│  │  │     │              │     │  └─ DashboardStatsDto.java
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
│  │  │     │                 │  ├─ DashboardService.java
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
│  │        │                    ├─ NoticeDashboardQueryRepository.java
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
├─ 요구.txt
└─ 이슈발생사항
   └─ XSS보안이슈.txt

```
```
sotemp
├─ @SuppressWarnings.txt
├─ codex.txt
├─ docs
│  ├─ notice_system_demo_script.html
│  ├─ notice_system_demo_script.txt
│  ├─ 공지등록.png
│  ├─ 공지발송결재.png
│  ├─ 공지발송히스토리.png
│  ├─ 공지상세.png
│  ├─ 대시보드.png
│  └─ 로그인.png
├─ my_data_ddl_20260128.sql
├─ my_tables_ddl_20260128.sql
├─ pnpm buildspring.txt
├─ README.md
├─ study
│  ├─ auth서버 로그인창 접근 후 버튼클릭시 401에러.txt
│  ├─ JPA.txt
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
│  │  │  ├─ main
│  │  │  │  ├─ java
│  │  │  │  │  └─ kr
│  │  │  │  │     └─ co
│  │  │  │  │        └─ koreazinc
│  │  │  │  │           └─ app
│  │  │  │  │              ├─ authentication
│  │  │  │  │              │  ├─ AuthorizationAccessChecker.java
│  │  │  │  │              │  └─ TokenAuthenticationProvider.java
│  │  │  │  │              ├─ configuration
│  │  │  │  │              │  ├─ JacksonConfig.java
│  │  │  │  │              │  ├─ MailTestProperty.java
│  │  │  │  │              │  ├─ NoticeSignatureStorageProperty.java
│  │  │  │  │              │  ├─ SchedulerConfig.java
│  │  │  │  │              │  ├─ SwaggerConfig.java
│  │  │  │  │              │  ├─ WebConfig.java
│  │  │  │  │              │  └─ WebSecurityConfig.java
│  │  │  │  │              ├─ controller
│  │  │  │  │              │  ├─ IndexController.java
│  │  │  │  │              │  └─ v1
│  │  │  │  │              │     ├─ account
│  │  │  │  │              │     │  └─ AccountController.java
│  │  │  │  │              │     ├─ admin
│  │  │  │  │              │     │  ├─ AdminDelegationController.java
│  │  │  │  │              │     │  └─ AdminUsersController.java
│  │  │  │  │              │     ├─ IndexController.java
│  │  │  │  │              │     └─ notice
│  │  │  │  │              │        ├─ DashboardController.java
│  │  │  │  │              │        ├─ MasterDataController.java
│  │  │  │  │              │        ├─ NoticeAttachmentController.java
│  │  │  │  │              │        ├─ NoticeController.java
│  │  │  │  │              │        ├─ NoticeResendController.java
│  │  │  │  │              │        ├─ NoticeSignatureController.java
│  │  │  │  │              │        ├─ NoticeSignatureImageController.java
│  │  │  │  │              │        └─ NoticeTemplateController.java
│  │  │  │  │              ├─ dto
│  │  │  │  │              │  ├─ admin
│  │  │  │  │              │  │  ├─ AdminDelegationDto.java
│  │  │  │  │              │  │  └─ AdminUserDto.java
│  │  │  │  │              │  └─ notice
│  │  │  │  │              │     ├─ ApiResponse.java
│  │  │  │  │              │     ├─ dashboard
│  │  │  │  │              │     │  └─ DashboardStatsDto.java
│  │  │  │  │              │     ├─ NoticeRegistrationDto.java
│  │  │  │  │              │     ├─ NoticeResponseDto.java
│  │  │  │  │              │     ├─ NoticeSignatureDto.java
│  │  │  │  │              │     └─ NoticeTemplateDto.java
│  │  │  │  │              ├─ MainApplication.java
│  │  │  │  │              ├─ model
│  │  │  │  │              │  ├─ account
│  │  │  │  │              │  │  ├─ AccountDto.java
│  │  │  │  │              │  │  └─ view
│  │  │  │  │              │  │     └─ VAccountDto.java
│  │  │  │  │              │  └─ security
│  │  │  │  │              │     └─ UserDetailsImpl.java
│  │  │  │  │              ├─ scheduler
│  │  │  │  │              │  └─ NoticeMailScheduler.java
│  │  │  │  │              └─ service
│  │  │  │  │                 ├─ account
│  │  │  │  │                 │  └─ AccountService.java
│  │  │  │  │                 ├─ admin
│  │  │  │  │                 │  ├─ AdminDelegationService.java
│  │  │  │  │                 │  └─ AuditLogService.java
│  │  │  │  │                 ├─ notice
│  │  │  │  │                 │  ├─ DashboardService.java
│  │  │  │  │                 │  ├─ NoticeAttachmentService.java
│  │  │  │  │                 │  ├─ NoticeMailService.java
│  │  │  │  │                 │  ├─ NoticeResendService.java
│  │  │  │  │                 │  ├─ NoticeService.java
│  │  │  │  │                 │  ├─ NoticeSignatureImageService.java
│  │  │  │  │                 │  ├─ NoticeSignatureService.java
│  │  │  │  │                 │  ├─ NoticeTemplateService.java
│  │  │  │  │                 │  └─ OutlookCalendarService.java
│  │  │  │  │                 └─ security
│  │  │  │  │                    └─ UserDetailsServiceImpl.java
│  │  │  │  └─ resources
│  │  │  │     ├─ config
│  │  │  │     │  ├─ application-dev.yaml
│  │  │  │     │  ├─ application-local.yaml
│  │  │  │     │  ├─ application-prod.yaml
│  │  │  │     │  └─ application.yaml
│  │  │  │     ├─ messages
│  │  │  │     │  ├─ messages.properties
│  │  │  │     │  ├─ messages_en.properties
│  │  │  │     │  └─ messages_ko.properties
│  │  │  │     ├─ META-INF
│  │  │  │     │  └─ additional-spring-configuration-metadata.json
│  │  │  │     ├─ scripts
│  │  │  │     │  └─ normalize_notice_target_keys.sql
│  │  │  │     └─ static
│  │  │  │        ├─ assets
│  │  │  │        │  ├─ index-DTJUd0rO.js
│  │  │  │        │  ├─ index-Sm_lquC6.css
│  │  │  │        │  └─ ssoClient-DBD03vVe.js
│  │  │  │        ├─ favicon.ico
│  │  │  │        ├─ index.html
│  │  │  │        └─ vite.svg
│  │  │  └─ test
│  │  │     ├─ java
│  │  │     │  └─ kr
│  │  │     │     └─ co
│  │  │     │        └─ koreazinc
│  │  │     │           └─ app
│  │  │     │              ├─ controller
│  │  │     │              │  └─ v1
│  │  │     │              │     └─ notice
│  │  │     │              │        └─ NoticeControllerTest.java
│  │  │     │              ├─ integration
│  │  │     │              │  ├─ NoticeApiIntegrationTest.java
│  │  │     │              │  ├─ NoticeMailIntegrationTest.java
│  │  │     │              │  └─ NoticeSchedulerIntegrationTest.java
│  │  │     │              └─ service
│  │  │     │                 └─ notice
│  │  │     │                    ├─ NoticeAttachmentServiceTest.java
│  │  │     │                    ├─ NoticeMailServiceTest.java
│  │  │     │                    ├─ NoticeResendServiceTest.java
│  │  │     │                    ├─ NoticeServiceTest.java
│  │  │     │                    ├─ NoticeSignatureImageServiceTest.java
│  │  │     │                    ├─ NoticeSignatureServiceTest.java
│  │  │     │                    └─ NoticeTemplateServiceTest.java
│  │  │     └─ resources
│  │  │        └─ application-test.yaml
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
│  │        │              │     ├─ admin
│  │        │              │     │  ├─ AdminDelegation.java
│  │        │              │     │  └─ AuditLog.java
│  │        │              │     └─ notice
│  │        │              │        ├─ CorporationMaster.java
│  │        │              │        ├─ NoticeAttachment.java
│  │        │              │        ├─ NoticeBase.java
│  │        │              │        ├─ NoticeCalendarEvent.java
│  │        │              │        ├─ NoticeDeliveryLog.java
│  │        │              │        ├─ NoticeRecipient.java
│  │        │              │        ├─ NoticeSendPlan.java
│  │        │              │        ├─ NoticeSignature.java
│  │        │              │        ├─ NoticeSignatureImage.java
│  │        │              │        ├─ NoticeTag.java
│  │        │              │        ├─ NoticeTarget.java
│  │        │              │        ├─ NoticeTemplate.java
│  │        │              │        ├─ OrganizationMaster.java
│  │        │              │        ├─ ServiceMaster.java
│  │        │              │        └─ UserMaster.java
│  │        │              └─ repository
│  │        │                 ├─ account
│  │        │                 │  ├─ AccountRepository.java
│  │        │                 │  └─ view
│  │        │                 │     └─ VAccountRepository.java
│  │        │                 ├─ admin
│  │        │                 │  ├─ AdminDelegationRepository.java
│  │        │                 │  └─ AuditLogRepository.java
│  │        │                 └─ notice
│  │        │                    ├─ CorporationMasterRepository.java
│  │        │                    ├─ NoticeAttachmentRepository.java
│  │        │                    ├─ NoticeBaseRepository.java
│  │        │                    ├─ NoticeCalendarEventRepository.java
│  │        │                    ├─ NoticeDashboardQueryRepository.java
│  │        │                    ├─ NoticeDeliveryLogRepository.java
│  │        │                    ├─ NoticeRecipientRepository.java
│  │        │                    ├─ NoticeSendPlanRepository.java
│  │        │                    ├─ NoticeSignatureImageRepository.java
│  │        │                    ├─ NoticeSignatureRepository.java
│  │        │                    ├─ NoticeTargetRepository.java
│  │        │                    ├─ NoticeTemplateRepository.java
│  │        │                    ├─ OrganizationMasterRepository.java
│  │        │                    ├─ ServiceMasterRepository.java
│  │        │                    └─ UserMasterRepository.java
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
│  ├─ GraphAPI설계서_메일_캘린더.html
│  ├─ pnpm buildspring.txt
│  ├─ react-app
│  │  ├─ app-api
│  │  │  └─ src
│  │  │     └─ main
│  │  │        └─ resources
│  │  │           └─ static
│  │  │              ├─ assets
│  │  │              │  ├─ index-BjhqJi6A.css
│  │  │              │  └─ index-ClgSr8ra.js
│  │  │              ├─ index.html
│  │  │              └─ vite.svg
│  │  ├─ eslint.config.js
│  │  ├─ index.html
│  │  ├─ package.json
│  │  ├─ pnpm-lock.yaml
│  │  ├─ public
│  │  │  ├─ favicon.ico
│  │  │  └─ vite.svg
│  │  ├─ README.md
│  │  ├─ scripts
│  │  │  ├─ copy-to-spring.cjs
│  │  │  └─ copy-to-spring.js
│  │  ├─ src
│  │  │  ├─ api
│  │  │  │  ├─ admin
│  │  │  │  │  ├─ adminDelegationApi.js
│  │  │  │  │  └─ adminUsersApi.js
│  │  │  │  ├─ index.js
│  │  │  │  ├─ master
│  │  │  │  │  ├─ corporationApi.js
│  │  │  │  │  ├─ organizationApi.js
│  │  │  │  │  └─ serviceApi.js
│  │  │  │  └─ notice
│  │  │  │     ├─ approvalApi.js
│  │  │  │     ├─ dashboardApi.js
│  │  │  │     ├─ noticeApi.js
│  │  │  │     ├─ signatureApi.js
│  │  │  │     └─ templateApi.js
│  │  │  ├─ App.css
│  │  │  ├─ App.jsx
│  │  │  ├─ assets
│  │  │  │  └─ react.svg
│  │  │  ├─ auth
│  │  │  │  ├─ authConfig.js
│  │  │  │  └─ session.js
│  │  │  ├─ components
│  │  │  │  ├─ AdminDelegationModal.css
│  │  │  │  ├─ AdminDelegationModal.jsx
│  │  │  │  ├─ AppHeader.css
│  │  │  │  └─ AppHeader.jsx
│  │  │  ├─ config
│  │  │  │  └─ apiConfig.js
│  │  │  ├─ contexts
│  │  │  │  └─ AdminContext.jsx
│  │  │  ├─ editor
│  │  │  │  ├─ NoticeEditor.js
│  │  │  │  └─ plugins
│  │  │  │     ├─ FontSizeInput.js
│  │  │  │     ├─ NoticeEditorActions.js
│  │  │  │     └─ TableCellAlign.js
│  │  │  ├─ index.css
│  │  │  ├─ layouts
│  │  │  │  └─ AppLayout.jsx
│  │  │  ├─ main.jsx
│  │  │  ├─ pages
│  │  │  │  ├─ AdminSettings.css
│  │  │  │  ├─ AdminSettings.jsx
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
│  │  │  ├─ styles
│  │  │  │  └─ modalScrollFix.css
│  │  │  └─ utils
│  │  │     ├─ apiClient.js
│  │  │     ├─ modalScrollUtils.js
│  │  │     └─ modalUtils.js
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
│  ├─ req.html
│  ├─ settings.gradle
│  ├─ spring-core
│  │  ├─ .editorconfig
│  │  ├─ .factorypath
│  │  ├─ build.gradle
│  │  ├─ docs
│  │  │  └─ error-response.md
│  │  └─ src
│  │     ├─ main
│  │     │  ├─ java
│  │     │  │  └─ kr
│  │     │  │     └─ co
│  │     │  │        └─ koreazinc
│  │     │  │           └─ spring
│  │     │  │              ├─ advice
│  │     │  │              │  ├─ GlobalExceptionAdvice.java
│  │     │  │              │  └─ GlobalRestExceptionAdvice.java
│  │     │  │              ├─ ApplicationContextHolder.java
│  │     │  │              ├─ configuration
│  │     │  │              │  ├─ GlobalWebConfig.java
│  │     │  │              │  ├─ JacksonConfig.java
│  │     │  │              │  └─ MessageConfig.java
│  │     │  │              ├─ controller
│  │     │  │              │  └─ ErrorController.java
│  │     │  │              ├─ convert
│  │     │  │              │  ├─ AbstractConverter.java
│  │     │  │              │  └─ converter
│  │     │  │              │     ├─ HttpStatusConverter.java
│  │     │  │              │     ├─ StringConverter.java
│  │     │  │              │     └─ UUIDConverter.java
│  │     │  │              ├─ CustomBeanNameGenerator.java
│  │     │  │              ├─ CustomResourceBundleMessageSource.java
│  │     │  │              ├─ CustomYamlPropertiesInitializer.java
│  │     │  │              ├─ exception
│  │     │  │              │  ├─ JwtIssuanceException.java
│  │     │  │              │  ├─ NotValidException.java
│  │     │  │              │  └─ TokenIssuanceException.java
│  │     │  │              ├─ filter
│  │     │  │              │  ├─ AttributeContextFilter.java
│  │     │  │              │  ├─ GlobalExceptionFilter.java
│  │     │  │              │  └─ RequestDecoratingFilter.java
│  │     │  │              ├─ http
│  │     │  │              │  ├─ codec
│  │     │  │              │  │  ├─ Jackson2XmlDecoder.java
│  │     │  │              │  │  └─ Jackson2XmlEncoder.java
│  │     │  │              │  ├─ enhancer
│  │     │  │              │  │  └─ HttpEnhancer.java
│  │     │  │              │  ├─ functional
│  │     │  │              │  │  └─ HttpFunction.java
│  │     │  │              │  ├─ matcher
│  │     │  │              │  │  ├─ DomainRequestMatcher.java
│  │     │  │              │  │  └─ PrefixPathRequestMatcher.java
│  │     │  │              │  ├─ RequestWrapper.java
│  │     │  │              │  ├─ util
│  │     │  │              │  │  ├─ ErrorResponse.java
│  │     │  │              │  │  └─ PageResponse.java
│  │     │  │              │  └─ utility
│  │     │  │              │     ├─ HttpUtils.java
│  │     │  │              │     └─ UriUtils.java
│  │     │  │              ├─ jackson
│  │     │  │              │  ├─ deserializer
│  │     │  │              │  └─ serializer
│  │     │  │              │     └─ HttpMethodSerializer.java
│  │     │  │              ├─ model
│  │     │  │              │  ├─ FileInfo.java
│  │     │  │              │  └─ MailInfo.java
│  │     │  │              ├─ property
│  │     │  │              │  ├─ PathProperty.java
│  │     │  │              │  └─ SpringProperty.java
│  │     │  │              ├─ security
│  │     │  │              │  ├─ adapter
│  │     │  │              │  │  ├─ CoreSecurityConfigurerAdapter.java
│  │     │  │              │  │  └─ SecurityProperties.java
│  │     │  │              │  ├─ authentication
│  │     │  │              │  │  ├─ AuthenticationManagerImpl.java
│  │     │  │              │  │  ├─ AuthorizationCodeAuthenticationProvider.java
│  │     │  │              │  │  ├─ AuthorizationCodeAuthenticationToken.java
│  │     │  │              │  │  ├─ CookieAuthenticationToken.java
│  │     │  │              │  │  ├─ OAuthAuthenticationProvider.java
│  │     │  │              │  │  ├─ OAuthAuthenticationToken.java
│  │     │  │              │  │  ├─ PassportAuthenticationToken.java
│  │     │  │              │  │  ├─ PasswordAuthenticationProvider.java
│  │     │  │              │  │  ├─ PasswordAuthenticationToken.java
│  │     │  │              │  │  └─ TokenAuthenticationToken.java
│  │     │  │              │  ├─ authorization
│  │     │  │              │  │  ├─ BasicAccessDeniedHandler.java
│  │     │  │              │  │  └─ BasicAuthenticationEntryPoint.java
│  │     │  │              │  ├─ exception
│  │     │  │              │  │  └─ UserJoinFailedException.java
│  │     │  │              │  ├─ filter
│  │     │  │              │  │  ├─ AuthorizationCodeAuthenticationFilter.java
│  │     │  │              │  │  ├─ CookieAuthenticationFilter.java
│  │     │  │              │  │  ├─ OAuthAuthenticationFilter.java
│  │     │  │              │  │  ├─ PasswordAuthenticationFilter.java
│  │     │  │              │  │  └─ TokenAuthenticationFilter.java
│  │     │  │              │  ├─ functional
│  │     │  │              │  │  ├─ ClearToken.java
│  │     │  │              │  │  ├─ GetCookie.java
│  │     │  │              │  │  └─ GetToken.java
│  │     │  │              │  ├─ model
│  │     │  │              │  │  ├─ ResponseToken.java
│  │     │  │              │  │  └─ UserInfo.java
│  │     │  │              │  ├─ property
│  │     │  │              │  │  └─ OAuth2Property.java
│  │     │  │              │  ├─ service
│  │     │  │              │  │  └─ ExpandUserDetailsService.java
│  │     │  │              │  └─ utility
│  │     │  │              │     ├─ AuthenticationCookieUtils.java
│  │     │  │              │     └─ AuthenticationTokenUtils.java
│  │     │  │              ├─ support
│  │     │  │              │  └─ SuppressWarning.java
│  │     │  │              ├─ util
│  │     │  │              │  ├─ CommonMap.java
│  │     │  │              │  ├─ Device.java
│  │     │  │              │  ├─ OAuth.java
│  │     │  │              │  ├─ time
│  │     │  │              │  │  └─ DateTimeFormat.java
│  │     │  │              │  └─ validation
│  │     │  │              │     └─ ValidList.java
│  │     │  │              ├─ utility
│  │     │  │              │  ├─ FileUtils.java
│  │     │  │              │  ├─ JwtUtils.java
│  │     │  │              │  ├─ MailUtils.java
│  │     │  │              │  ├─ MessageUtils.java
│  │     │  │              │  ├─ OAuthUtils.java
│  │     │  │              │  └─ PropertyUtils.java
│  │     │  │              └─ web
│  │     │  │                 ├─ reactive
│  │     │  │                 │  ├─ exception
│  │     │  │                 │  │  └─ NotFoundException.java
│  │     │  │                 │  ├─ HandlerInterceptor.java
│  │     │  │                 │  └─ i18n
│  │     │  │                 │     ├─ AbstractLocaleContextResolver.java
│  │     │  │                 │     ├─ AbstractLocaleResolver.java
│  │     │  │                 │     ├─ CookieLocaleResolver.java
│  │     │  │                 │     └─ LocaleChangeInterceptor.java
│  │     │  │                 └─ servlet
│  │     │  │                    ├─ context
│  │     │  │                    │  ├─ ContextHolder.java
│  │     │  │                    │  ├─ ContextResolver.java
│  │     │  │                    │  ├─ DomainContext.java
│  │     │  │                    │  ├─ DomainContextMatcher.java
│  │     │  │                    │  └─ DomainContextResolver.java
│  │     │  │                    ├─ exception
│  │     │  │                    │  └─ NotFoundException.java
│  │     │  │                    └─ result
│  │     │  │                       └─ view
│  │     │  │                          ├─ DefaultModelingBuilder.java
│  │     │  │                          ├─ Modeling.java
│  │     │  │                          └─ RedirectModel.java
│  │     │  └─ resources
│  │     │     ├─ banner.txt
│  │     │     ├─ config
│  │     │     │  ├─ custom-spring-core-dev.yaml
│  │     │     │  ├─ custom-spring-core-local.yaml
│  │     │     │  ├─ custom-spring-core-prod.yaml
│  │     │     │  └─ custom-spring-core-test.yaml
│  │     │     ├─ favicon.ico
│  │     │     ├─ logback
│  │     │     │  ├─ appender-console.xml
│  │     │     │  ├─ appender-file.xml
│  │     │     │  ├─ common.xml
│  │     │     │  ├─ logger-dev.xml
│  │     │     │  ├─ logger-local.xml
│  │     │     │  └─ logger-prod.xml
│  │     │     ├─ logback-spring.xml
│  │     │     ├─ messages
│  │     │     │  ├─ core-messages.properties
│  │     │     │  ├─ core-messages_en.properties
│  │     │     │  └─ core-messages_ko.properties
│  │     │     ├─ META-INF
│  │     │     │  ├─ additional-spring-configuration-metadata.json
│  │     │     │  └─ spring.factories
│  │     │     ├─ robots.txt
│  │     │     ├─ security
│  │     │     │  ├─ openssl.txt
│  │     │     │  ├─ private.der
│  │     │     │  ├─ private.key
│  │     │     │  ├─ public.der
│  │     │     │  └─ public.pem
│  │     │     └─ templates
│  │     │        └─ error.html
│  │     └─ test
│  │        └─ java
│  │           └─ kr
│  │              └─ co
│  │                 └─ koreazinc
│  │                    └─ spring
│  │                       ├─ demo
│  │                       │  └─ SampleCalculatorTest.java
│  │                       └─ http
│  │                          ├─ RequestWrapperTest.java
│  │                          ├─ util
│  │                          │  └─ ErrorResponseTest.java
│  │                          └─ utility
│  │                             └─ UriUtilsTest.java
│  ├─ system-flow-diagram.html
│  ├─ SYSTEM_FLOW_DETAILED.md
│  ├─ TEST_SCENARIOS.md
│  ├─ TEST_SCENARIO_GUIDE.md
│  └─ _NoticeApproval_head.jsx
├─ temp-migration
│  ├─ controllers
│  ├─ dtos
│  ├─ entities
│  ├─ notice_base_notice_type.sql
│  ├─ notice_template_signature_ddl.sql
│  ├─ repositories
│  └─ services
├─ 개발운영분리.txt
├─ 공지결재 관리자 프로세스 추가
│  ├─ 1차 초안 개발.md
│  ├─ 2차 디자인 개선.md
│  ├─ 3차 api요청 헤더 추가.md
│  ├─ 4차 한글이름 인코딩base64적용.md
│  ├─ 5차 위임설정시 프론트백 초 필수조건차이에관한 오류해결.md
│  └─ 오류.txt
├─ 공지등록 메일발송 프로세스
│  ├─ 1차_메일발송시스템_가이드.md
│  ├─ 2차_OAuth2Property_수정가이드.md
│  ├─ 3차_메일테스트모드_설정가이드.md
│  ├─ 4차_공지발송_전체흐름_가이드.md
│  ├─ 5차_캘린더테스트모드_가이드.md
│  ├─ 6차_메일캘린더_통합테스트_가이드.md
│  ├─ 공지등록_메일발송_캘린더등록.HTML
│  └─ 공지등록_메일발송_캘린더등록.txt
├─ 멀티모듈프로필.txt
├─ 발표준비.txt
├─ 발표준비파일.txt
├─ 보고용.txt
├─ 산출물
│  ├─ API
│  │  ├─ API테스트.txt
│  │  └─ 조직도API.md
│  ├─ DB설계
│  │  ├─ DB설계서
│  │  │  ├─ noticegate_db_design_spec_v1.2_full_notice_names_EN.html
│  │  │  └─ noticegate_db_design_spec_v1.3_enum_indexes.html
│  │  ├─ DDL.txt
│  │  ├─ ERD
│  │  │  ├─ erd.png
│  │  │  ├─ erdKey.txt
│  │  │  └─ erd_light.svg
│  │  ├─ 서비스법인부서샘플.txt
│  │  ├─ 실제데이터
│  │  │  ├─ my_tables_data.sql
│  │  │  └─ my_tables_ddl.sql
│  │  └─ 테이블정의서
│  │     └─ noticegate_table_definition_v1.2_full_notice_names_EN.xlsx
│  ├─ outlook.png
│  ├─ 도메인모델
│  │  └─ 공지사항관리_도메인모델.html
│  ├─ 요구사항정의서
│  │  └─ 공지사항관리_요구사항정의서_1.1.html
│  ├─ 작업 분류 구조도(WBS)
│  │  ├─ 공지관리시스템_WBS_20260108.xlsx
│  │  └─ 구버전
│  │     ├─ IT_Notice_WBS_20251218.html
│  │     ├─ IT_Notice_WBS_20251218_V2.html
│  │     ├─ IT_Notice_WBS_Detailed.csv
│  │     ├─ IT_Notice_WBS_Detailed.xlsx
│  │     ├─ WBS_updated_2026-01-05.html
│  │     ├─ WBS_updated_2026-01-06.html
│  │     ├─ WBS_v2.1_IT공지관리시스템_엑셀_20251219.xlsx
│  │     ├─ 공지관리시스템_WBS_20260108.xlsx
│  │     └─ 공지사항관리_WBS_2025-12-19 (1).html
│  ├─ 제안서
│  │  ├─ IT 공지 업무 개선 제안서_Ver_1.0_20251103.pdf
│  │  └─ Ver_1.0_20251103.pdf
│  ├─ 중간발표
│  │  ├─ 공지관리시스템_중간발표_함윤식 [자동 저장].pptx
│  │  ├─ 공지관리시스템_중간발표_함윤식.pptx
│  │  ├─ 발표준비1.png
│  │  ├─ 새 텍스트 문서.txt
│  │  └─ 중간발표템플릿.pptx
│  ├─ 중간발표_slides_dark.html
│  ├─ 플로우도
│  │  └─ untitled_diagram.png
│  ├─ 피드백.txt
│  └─ 화면설계서
│     ├─ 공지관리시스템_화면설계서.docx
│     ├─ 공지대시보드.png
│     ├─ 공지등록화면.png
│     ├─ 공지발송결재.png
│     ├─ 공지발송히스토리.png
│     └─ 프레젠테이션1.pptx
├─ 요구.txt
├─ 이슈발생사항
│  ├─ XSS보안이슈.txt
│  └─ 로그인자동.txt
└─ 테스트
   ├─ COMPLETE_TEST_GUIDE.html
   ├─ notice_system_test_guide.html
   └─ notice_system_test_guide.xlsx

```
```
sotemp
├─ @SuppressWarnings.txt
├─ codex.txt
├─ docs
│  ├─ notice_system_demo_script.html
│  ├─ notice_system_demo_script.txt
│  ├─ 공지등록.png
│  ├─ 공지발송결재.png
│  ├─ 공지발송히스토리.png
│  ├─ 공지상세.png
│  ├─ 대시보드.png
│  └─ 로그인.png
├─ my_data_ddl_20260128.sql
├─ my_tables_ddl_20260128.sql
├─ pnpm buildspring.txt
├─ README.md
├─ study
│  ├─ auth서버 로그인창 접근 후 버튼클릭시 401에러.txt
│  ├─ JPA.txt
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
│  │  │  ├─ main
│  │  │  │  ├─ java
│  │  │  │  │  └─ kr
│  │  │  │  │     └─ co
│  │  │  │  │        └─ koreazinc
│  │  │  │  │           └─ app
│  │  │  │  │              ├─ authentication
│  │  │  │  │              │  ├─ AuthorizationAccessChecker.java
│  │  │  │  │              │  └─ TokenAuthenticationProvider.java
│  │  │  │  │              ├─ configuration
│  │  │  │  │              │  ├─ JacksonConfig.java
│  │  │  │  │              │  ├─ MailTestProperty.java
│  │  │  │  │              │  ├─ NoticeSignatureStorageProperty.java
│  │  │  │  │              │  ├─ SchedulerConfig.java
│  │  │  │  │              │  ├─ SwaggerConfig.java
│  │  │  │  │              │  ├─ WebConfig.java
│  │  │  │  │              │  └─ WebSecurityConfig.java
│  │  │  │  │              ├─ controller
│  │  │  │  │              │  ├─ IndexController.java
│  │  │  │  │              │  └─ v1
│  │  │  │  │              │     ├─ account
│  │  │  │  │              │     │  └─ AccountController.java
│  │  │  │  │              │     ├─ admin
│  │  │  │  │              │     │  ├─ AdminDelegationController.java
│  │  │  │  │              │     │  └─ AdminUsersController.java
│  │  │  │  │              │     ├─ IndexController.java
│  │  │  │  │              │     └─ notice
│  │  │  │  │              │        ├─ DashboardController.java
│  │  │  │  │              │        ├─ MasterDataController.java
│  │  │  │  │              │        ├─ NoticeAttachmentController.java
│  │  │  │  │              │        ├─ NoticeController.java
│  │  │  │  │              │        ├─ NoticeResendController.java
│  │  │  │  │              │        ├─ NoticeSignatureController.java
│  │  │  │  │              │        ├─ NoticeSignatureImageController.java
│  │  │  │  │              │        └─ NoticeTemplateController.java
│  │  │  │  │              ├─ dto
│  │  │  │  │              │  ├─ admin
│  │  │  │  │              │  │  ├─ AdminDelegationDto.java
│  │  │  │  │              │  │  └─ AdminUserDto.java
│  │  │  │  │              │  └─ notice
│  │  │  │  │              │     ├─ ApiResponse.java
│  │  │  │  │              │     ├─ dashboard
│  │  │  │  │              │     │  └─ DashboardStatsDto.java
│  │  │  │  │              │     ├─ NoticeRegistrationDto.java
│  │  │  │  │              │     ├─ NoticeResponseDto.java
│  │  │  │  │              │     ├─ NoticeSignatureDto.java
│  │  │  │  │              │     └─ NoticeTemplateDto.java
│  │  │  │  │              ├─ MainApplication.java
│  │  │  │  │              ├─ model
│  │  │  │  │              │  ├─ account
│  │  │  │  │              │  │  ├─ AccountDto.java
│  │  │  │  │              │  │  └─ view
│  │  │  │  │              │  │     └─ VAccountDto.java
│  │  │  │  │              │  └─ security
│  │  │  │  │              │     └─ UserDetailsImpl.java
│  │  │  │  │              ├─ scheduler
│  │  │  │  │              │  └─ NoticeMailScheduler.java
│  │  │  │  │              └─ service
│  │  │  │  │                 ├─ account
│  │  │  │  │                 │  └─ AccountService.java
│  │  │  │  │                 ├─ admin
│  │  │  │  │                 │  ├─ AdminDelegationService.java
│  │  │  │  │                 │  └─ AuditLogService.java
│  │  │  │  │                 ├─ notice
│  │  │  │  │                 │  ├─ DashboardService.java
│  │  │  │  │                 │  ├─ NoticeAttachmentService.java
│  │  │  │  │                 │  ├─ NoticeMailService.java
│  │  │  │  │                 │  ├─ NoticeResendService.java
│  │  │  │  │                 │  ├─ NoticeService.java
│  │  │  │  │                 │  ├─ NoticeSignatureImageService.java
│  │  │  │  │                 │  ├─ NoticeSignatureService.java
│  │  │  │  │                 │  ├─ NoticeTemplateService.java
│  │  │  │  │                 │  └─ OutlookCalendarService.java
│  │  │  │  │                 └─ security
│  │  │  │  │                    └─ UserDetailsServiceImpl.java
│  │  │  │  └─ resources
│  │  │  │     ├─ config
│  │  │  │     │  ├─ application-dev.yaml
│  │  │  │     │  ├─ application-local.yaml
│  │  │  │     │  ├─ application-prod.yaml
│  │  │  │     │  └─ application.yaml
│  │  │  │     ├─ messages
│  │  │  │     │  ├─ messages.properties
│  │  │  │     │  ├─ messages_en.properties
│  │  │  │     │  └─ messages_ko.properties
│  │  │  │     ├─ META-INF
│  │  │  │     │  └─ additional-spring-configuration-metadata.json
│  │  │  │     ├─ scripts
│  │  │  │     │  └─ normalize_notice_target_keys.sql
│  │  │  │     └─ static
│  │  │  │        ├─ assets
│  │  │  │        │  ├─ index-DTJUd0rO.js
│  │  │  │        │  ├─ index-Sm_lquC6.css
│  │  │  │        │  └─ ssoClient-DBD03vVe.js
│  │  │  │        ├─ favicon.ico
│  │  │  │        ├─ index.html
│  │  │  │        └─ vite.svg
│  │  │  └─ test
│  │  │     ├─ java
│  │  │     │  └─ kr
│  │  │     │     └─ co
│  │  │     │        └─ koreazinc
│  │  │     │           └─ app
│  │  │     │              ├─ controller
│  │  │     │              │  └─ v1
│  │  │     │              │     └─ notice
│  │  │     │              │        └─ NoticeControllerTest.java
│  │  │     │              ├─ integration
│  │  │     │              │  ├─ NoticeApiIntegrationTest.java
│  │  │     │              │  ├─ NoticeMailIntegrationTest.java
│  │  │     │              │  └─ NoticeSchedulerIntegrationTest.java
│  │  │     │              └─ service
│  │  │     │                 └─ notice
│  │  │     │                    ├─ NoticeAttachmentServiceTest.java
│  │  │     │                    ├─ NoticeMailServiceTest.java
│  │  │     │                    ├─ NoticeResendServiceTest.java
│  │  │     │                    ├─ NoticeServiceTest.java
│  │  │     │                    ├─ NoticeSignatureImageServiceTest.java
│  │  │     │                    ├─ NoticeSignatureServiceTest.java
│  │  │     │                    └─ NoticeTemplateServiceTest.java
│  │  │     └─ resources
│  │  │        └─ application-test.yaml
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
│  │        │              │     ├─ admin
│  │        │              │     │  ├─ AdminDelegation.java
│  │        │              │     │  └─ AuditLog.java
│  │        │              │     └─ notice
│  │        │              │        ├─ CorporationMaster.java
│  │        │              │        ├─ NoticeAttachment.java
│  │        │              │        ├─ NoticeBase.java
│  │        │              │        ├─ NoticeCalendarEvent.java
│  │        │              │        ├─ NoticeDeliveryLog.java
│  │        │              │        ├─ NoticeRecipient.java
│  │        │              │        ├─ NoticeSendPlan.java
│  │        │              │        ├─ NoticeSignature.java
│  │        │              │        ├─ NoticeSignatureImage.java
│  │        │              │        ├─ NoticeTag.java
│  │        │              │        ├─ NoticeTarget.java
│  │        │              │        ├─ NoticeTemplate.java
│  │        │              │        ├─ OrganizationMaster.java
│  │        │              │        ├─ ServiceMaster.java
│  │        │              │        └─ UserMaster.java
│  │        │              └─ repository
│  │        │                 ├─ account
│  │        │                 │  ├─ AccountRepository.java
│  │        │                 │  └─ view
│  │        │                 │     └─ VAccountRepository.java
│  │        │                 ├─ admin
│  │        │                 │  ├─ AdminDelegationRepository.java
│  │        │                 │  └─ AuditLogRepository.java
│  │        │                 └─ notice
│  │        │                    ├─ CorporationMasterRepository.java
│  │        │                    ├─ NoticeAttachmentRepository.java
│  │        │                    ├─ NoticeBaseRepository.java
│  │        │                    ├─ NoticeCalendarEventRepository.java
│  │        │                    ├─ NoticeDashboardQueryRepository.java
│  │        │                    ├─ NoticeDeliveryLogRepository.java
│  │        │                    ├─ NoticeRecipientRepository.java
│  │        │                    ├─ NoticeSendPlanRepository.java
│  │        │                    ├─ NoticeSignatureImageRepository.java
│  │        │                    ├─ NoticeSignatureRepository.java
│  │        │                    ├─ NoticeTargetRepository.java
│  │        │                    ├─ NoticeTemplateRepository.java
│  │        │                    ├─ OrganizationMasterRepository.java
│  │        │                    ├─ ServiceMasterRepository.java
│  │        │                    └─ UserMasterRepository.java
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
│  ├─ GraphAPI설계서_메일_캘린더.html
│  ├─ pnpm buildspring.txt
│  ├─ react-app
│  │  ├─ app-api
│  │  │  └─ src
│  │  │     └─ main
│  │  │        └─ resources
│  │  │           └─ static
│  │  │              ├─ assets
│  │  │              │  ├─ index-BjhqJi6A.css
│  │  │              │  └─ index-ClgSr8ra.js
│  │  │              ├─ index.html
│  │  │              └─ vite.svg
│  │  ├─ eslint.config.js
│  │  ├─ index.html
│  │  ├─ package.json
│  │  ├─ pnpm-lock.yaml
│  │  ├─ public
│  │  │  ├─ favicon.ico
│  │  │  └─ vite.svg
│  │  ├─ README.md
│  │  ├─ scripts
│  │  │  ├─ copy-to-spring.cjs
│  │  │  └─ copy-to-spring.js
│  │  ├─ src
│  │  │  ├─ api
│  │  │  │  ├─ admin
│  │  │  │  │  ├─ adminDelegationApi.js
│  │  │  │  │  └─ adminUsersApi.js
│  │  │  │  ├─ index.js
│  │  │  │  ├─ master
│  │  │  │  │  ├─ corporationApi.js
│  │  │  │  │  ├─ organizationApi.js
│  │  │  │  │  └─ serviceApi.js
│  │  │  │  └─ notice
│  │  │  │     ├─ approvalApi.js
│  │  │  │     ├─ dashboardApi.js
│  │  │  │     ├─ noticeApi.js
│  │  │  │     ├─ signatureApi.js
│  │  │  │     └─ templateApi.js
│  │  │  ├─ App.css
│  │  │  ├─ App.jsx
│  │  │  ├─ assets
│  │  │  │  └─ react.svg
│  │  │  ├─ auth
│  │  │  │  ├─ authConfig.js
│  │  │  │  └─ session.js
│  │  │  ├─ components
│  │  │  │  ├─ AdminDelegationModal.css
│  │  │  │  ├─ AdminDelegationModal.jsx
│  │  │  │  ├─ AppHeader.css
│  │  │  │  └─ AppHeader.jsx
│  │  │  ├─ config
│  │  │  │  └─ apiConfig.js
│  │  │  ├─ contexts
│  │  │  │  └─ AdminContext.jsx
│  │  │  ├─ editor
│  │  │  │  ├─ NoticeEditor.js
│  │  │  │  └─ plugins
│  │  │  │     ├─ FontSizeInput.js
│  │  │  │     ├─ NoticeEditorActions.js
│  │  │  │     └─ TableCellAlign.js
│  │  │  ├─ index.css
│  │  │  ├─ layouts
│  │  │  │  └─ AppLayout.jsx
│  │  │  ├─ main.jsx
│  │  │  ├─ pages
│  │  │  │  ├─ AdminSettings.css
│  │  │  │  ├─ AdminSettings.jsx
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
│  │  │  ├─ styles
│  │  │  │  └─ modalScrollFix.css
│  │  │  └─ utils
│  │  │     ├─ apiClient.js
│  │  │     ├─ modalScrollUtils.js
│  │  │     └─ modalUtils.js
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
│  ├─ req.html
│  ├─ settings.gradle
│  ├─ spring-core
│  │  ├─ .editorconfig
│  │  ├─ .factorypath
│  │  ├─ build.gradle
│  │  ├─ docs
│  │  │  └─ error-response.md
│  │  └─ src
│  │     ├─ main
│  │     │  ├─ java
│  │     │  │  └─ kr
│  │     │  │     └─ co
│  │     │  │        └─ koreazinc
│  │     │  │           └─ spring
│  │     │  │              ├─ advice
│  │     │  │              │  ├─ GlobalExceptionAdvice.java
│  │     │  │              │  └─ GlobalRestExceptionAdvice.java
│  │     │  │              ├─ ApplicationContextHolder.java
│  │     │  │              ├─ configuration
│  │     │  │              │  ├─ GlobalWebConfig.java
│  │     │  │              │  ├─ JacksonConfig.java
│  │     │  │              │  └─ MessageConfig.java
│  │     │  │              ├─ controller
│  │     │  │              │  └─ ErrorController.java
│  │     │  │              ├─ convert
│  │     │  │              │  ├─ AbstractConverter.java
│  │     │  │              │  └─ converter
│  │     │  │              │     ├─ HttpStatusConverter.java
│  │     │  │              │     ├─ StringConverter.java
│  │     │  │              │     └─ UUIDConverter.java
│  │     │  │              ├─ CustomBeanNameGenerator.java
│  │     │  │              ├─ CustomResourceBundleMessageSource.java
│  │     │  │              ├─ CustomYamlPropertiesInitializer.java
│  │     │  │              ├─ exception
│  │     │  │              │  ├─ JwtIssuanceException.java
│  │     │  │              │  ├─ NotValidException.java
│  │     │  │              │  └─ TokenIssuanceException.java
│  │     │  │              ├─ filter
│  │     │  │              │  ├─ AttributeContextFilter.java
│  │     │  │              │  ├─ GlobalExceptionFilter.java
│  │     │  │              │  └─ RequestDecoratingFilter.java
│  │     │  │              ├─ http
│  │     │  │              │  ├─ codec
│  │     │  │              │  │  ├─ Jackson2XmlDecoder.java
│  │     │  │              │  │  └─ Jackson2XmlEncoder.java
│  │     │  │              │  ├─ enhancer
│  │     │  │              │  │  └─ HttpEnhancer.java
│  │     │  │              │  ├─ functional
│  │     │  │              │  │  └─ HttpFunction.java
│  │     │  │              │  ├─ matcher
│  │     │  │              │  │  ├─ DomainRequestMatcher.java
│  │     │  │              │  │  └─ PrefixPathRequestMatcher.java
│  │     │  │              │  ├─ RequestWrapper.java
│  │     │  │              │  ├─ util
│  │     │  │              │  │  ├─ ErrorResponse.java
│  │     │  │              │  │  └─ PageResponse.java
│  │     │  │              │  └─ utility
│  │     │  │              │     ├─ HttpUtils.java
│  │     │  │              │     └─ UriUtils.java
│  │     │  │              ├─ jackson
│  │     │  │              │  ├─ deserializer
│  │     │  │              │  └─ serializer
│  │     │  │              │     └─ HttpMethodSerializer.java
│  │     │  │              ├─ model
│  │     │  │              │  ├─ FileInfo.java
│  │     │  │              │  └─ MailInfo.java
│  │     │  │              ├─ property
│  │     │  │              │  ├─ PathProperty.java
│  │     │  │              │  └─ SpringProperty.java
│  │     │  │              ├─ security
│  │     │  │              │  ├─ adapter
│  │     │  │              │  │  ├─ CoreSecurityConfigurerAdapter.java
│  │     │  │              │  │  └─ SecurityProperties.java
│  │     │  │              │  ├─ authentication
│  │     │  │              │  │  ├─ AuthenticationManagerImpl.java
│  │     │  │              │  │  ├─ AuthorizationCodeAuthenticationProvider.java
│  │     │  │              │  │  ├─ AuthorizationCodeAuthenticationToken.java
│  │     │  │              │  │  ├─ CookieAuthenticationToken.java
│  │     │  │              │  │  ├─ OAuthAuthenticationProvider.java
│  │     │  │              │  │  ├─ OAuthAuthenticationToken.java
│  │     │  │              │  │  ├─ PassportAuthenticationToken.java
│  │     │  │              │  │  ├─ PasswordAuthenticationProvider.java
│  │     │  │              │  │  ├─ PasswordAuthenticationToken.java
│  │     │  │              │  │  └─ TokenAuthenticationToken.java
│  │     │  │              │  ├─ authorization
│  │     │  │              │  │  ├─ BasicAccessDeniedHandler.java
│  │     │  │              │  │  └─ BasicAuthenticationEntryPoint.java
│  │     │  │              │  ├─ exception
│  │     │  │              │  │  └─ UserJoinFailedException.java
│  │     │  │              │  ├─ filter
│  │     │  │              │  │  ├─ AuthorizationCodeAuthenticationFilter.java
│  │     │  │              │  │  ├─ CookieAuthenticationFilter.java
│  │     │  │              │  │  ├─ OAuthAuthenticationFilter.java
│  │     │  │              │  │  ├─ PasswordAuthenticationFilter.java
│  │     │  │              │  │  └─ TokenAuthenticationFilter.java
│  │     │  │              │  ├─ functional
│  │     │  │              │  │  ├─ ClearToken.java
│  │     │  │              │  │  ├─ GetCookie.java
│  │     │  │              │  │  └─ GetToken.java
│  │     │  │              │  ├─ model
│  │     │  │              │  │  ├─ ResponseToken.java
│  │     │  │              │  │  └─ UserInfo.java
│  │     │  │              │  ├─ property
│  │     │  │              │  │  └─ OAuth2Property.java
│  │     │  │              │  ├─ service
│  │     │  │              │  │  └─ ExpandUserDetailsService.java
│  │     │  │              │  └─ utility
│  │     │  │              │     ├─ AuthenticationCookieUtils.java
│  │     │  │              │     └─ AuthenticationTokenUtils.java
│  │     │  │              ├─ support
│  │     │  │              │  └─ SuppressWarning.java
│  │     │  │              ├─ util
│  │     │  │              │  ├─ CommonMap.java
│  │     │  │              │  ├─ Device.java
│  │     │  │              │  ├─ OAuth.java
│  │     │  │              │  ├─ time
│  │     │  │              │  │  └─ DateTimeFormat.java
│  │     │  │              │  └─ validation
│  │     │  │              │     └─ ValidList.java
│  │     │  │              ├─ utility
│  │     │  │              │  ├─ FileUtils.java
│  │     │  │              │  ├─ JwtUtils.java
│  │     │  │              │  ├─ MailUtils.java
│  │     │  │              │  ├─ MessageUtils.java
│  │     │  │              │  ├─ OAuthUtils.java
│  │     │  │              │  └─ PropertyUtils.java
│  │     │  │              └─ web
│  │     │  │                 ├─ reactive
│  │     │  │                 │  ├─ exception
│  │     │  │                 │  │  └─ NotFoundException.java
│  │     │  │                 │  ├─ HandlerInterceptor.java
│  │     │  │                 │  └─ i18n
│  │     │  │                 │     ├─ AbstractLocaleContextResolver.java
│  │     │  │                 │     ├─ AbstractLocaleResolver.java
│  │     │  │                 │     ├─ CookieLocaleResolver.java
│  │     │  │                 │     └─ LocaleChangeInterceptor.java
│  │     │  │                 └─ servlet
│  │     │  │                    ├─ context
│  │     │  │                    │  ├─ ContextHolder.java
│  │     │  │                    │  ├─ ContextResolver.java
│  │     │  │                    │  ├─ DomainContext.java
│  │     │  │                    │  ├─ DomainContextMatcher.java
│  │     │  │                    │  └─ DomainContextResolver.java
│  │     │  │                    ├─ exception
│  │     │  │                    │  └─ NotFoundException.java
│  │     │  │                    └─ result
│  │     │  │                       └─ view
│  │     │  │                          ├─ DefaultModelingBuilder.java
│  │     │  │                          ├─ Modeling.java
│  │     │  │                          └─ RedirectModel.java
│  │     │  └─ resources
│  │     │     ├─ banner.txt
│  │     │     ├─ config
│  │     │     │  ├─ custom-spring-core-dev.yaml
│  │     │     │  ├─ custom-spring-core-local.yaml
│  │     │     │  ├─ custom-spring-core-prod.yaml
│  │     │     │  └─ custom-spring-core-test.yaml
│  │     │     ├─ favicon.ico
│  │     │     ├─ logback
│  │     │     │  ├─ appender-console.xml
│  │     │     │  ├─ appender-file.xml
│  │     │     │  ├─ common.xml
│  │     │     │  ├─ logger-dev.xml
│  │     │     │  ├─ logger-local.xml
│  │     │     │  └─ logger-prod.xml
│  │     │     ├─ logback-spring.xml
│  │     │     ├─ messages
│  │     │     │  ├─ core-messages.properties
│  │     │     │  ├─ core-messages_en.properties
│  │     │     │  └─ core-messages_ko.properties
│  │     │     ├─ META-INF
│  │     │     │  ├─ additional-spring-configuration-metadata.json
│  │     │     │  └─ spring.factories
│  │     │     ├─ robots.txt
│  │     │     ├─ security
│  │     │     │  ├─ openssl.txt
│  │     │     │  ├─ private.der
│  │     │     │  ├─ private.key
│  │     │     │  ├─ public.der
│  │     │     │  └─ public.pem
│  │     │     └─ templates
│  │     │        └─ error.html
│  │     └─ test
│  │        └─ java
│  │           └─ kr
│  │              └─ co
│  │                 └─ koreazinc
│  │                    └─ spring
│  │                       ├─ demo
│  │                       │  └─ SampleCalculatorTest.java
│  │                       └─ http
│  │                          ├─ RequestWrapperTest.java
│  │                          ├─ util
│  │                          │  └─ ErrorResponseTest.java
│  │                          └─ utility
│  │                             └─ UriUtilsTest.java
│  ├─ system-flow-diagram.html
│  ├─ SYSTEM_FLOW_DETAILED.md
│  ├─ TEST_SCENARIOS.md
│  ├─ TEST_SCENARIO_GUIDE.md
│  └─ _NoticeApproval_head.jsx
├─ temp-migration
│  ├─ controllers
│  ├─ dtos
│  ├─ entities
│  ├─ notice_base_notice_type.sql
│  ├─ notice_template_signature_ddl.sql
│  ├─ repositories
│  └─ services
├─ 개발운영분리.txt
├─ 공지결재 관리자 프로세스 추가
│  ├─ 1차 초안 개발.md
│  ├─ 2차 디자인 개선.md
│  ├─ 3차 api요청 헤더 추가.md
│  ├─ 4차 한글이름 인코딩base64적용.md
│  ├─ 5차 위임설정시 프론트백 초 필수조건차이에관한 오류해결.md
│  └─ 오류.txt
├─ 공지등록 메일발송 프로세스
│  ├─ 1차_메일발송시스템_가이드.md
│  ├─ 2차_OAuth2Property_수정가이드.md
│  ├─ 3차_메일테스트모드_설정가이드.md
│  ├─ 4차_공지발송_전체흐름_가이드.md
│  ├─ 5차_캘린더테스트모드_가이드.md
│  ├─ 6차_메일캘린더_통합테스트_가이드.md
│  ├─ 공지등록_메일발송_캘린더등록.HTML
│  └─ 공지등록_메일발송_캘린더등록.txt
├─ 멀티모듈프로필.txt
├─ 발표준비.txt
├─ 발표준비파일.txt
├─ 보고용.txt
├─ 산출물
│  ├─ API
│  │  ├─ API테스트.txt
│  │  └─ 조직도API.md
│  ├─ DB설계
│  │  ├─ DB설계서
│  │  │  ├─ noticegate_db_design_spec_v1.2_full_notice_names_EN.html
│  │  │  └─ noticegate_db_design_spec_v1.3_enum_indexes.html
│  │  ├─ DDL.txt
│  │  ├─ ERD
│  │  │  ├─ erd.png
│  │  │  ├─ erdKey.txt
│  │  │  └─ erd_light.svg
│  │  ├─ 서비스법인부서샘플.txt
│  │  ├─ 실제데이터
│  │  │  ├─ my_tables_data.sql
│  │  │  └─ my_tables_ddl.sql
│  │  └─ 테이블정의서
│  │     └─ noticegate_table_definition_v1.2_full_notice_names_EN.xlsx
│  ├─ outlook.png
│  ├─ 도메인모델
│  │  └─ 공지사항관리_도메인모델.html
│  ├─ 요구사항정의서
│  │  └─ 공지사항관리_요구사항정의서_1.1.html
│  ├─ 작업 분류 구조도(WBS)
│  │  ├─ 공지관리시스템_WBS_20260108.xlsx
│  │  └─ 구버전
│  │     ├─ IT_Notice_WBS_20251218.html
│  │     ├─ IT_Notice_WBS_20251218_V2.html
│  │     ├─ IT_Notice_WBS_Detailed.csv
│  │     ├─ IT_Notice_WBS_Detailed.xlsx
│  │     ├─ WBS_updated_2026-01-05.html
│  │     ├─ WBS_updated_2026-01-06.html
│  │     ├─ WBS_v2.1_IT공지관리시스템_엑셀_20251219.xlsx
│  │     ├─ 공지관리시스템_WBS_20260108.xlsx
│  │     └─ 공지사항관리_WBS_2025-12-19 (1).html
│  ├─ 제안서
│  │  ├─ IT 공지 업무 개선 제안서_Ver_1.0_20251103.pdf
│  │  └─ Ver_1.0_20251103.pdf
│  ├─ 중간발표
│  │  ├─ 공지관리시스템_중간발표_함윤식 [자동 저장].pptx
│  │  ├─ 공지관리시스템_중간발표_함윤식.pptx
│  │  ├─ 발표준비1.png
│  │  ├─ 새 텍스트 문서.txt
│  │  └─ 중간발표템플릿.pptx
│  ├─ 중간발표_slides_dark.html
│  ├─ 플로우도
│  │  └─ untitled_diagram.png
│  ├─ 피드백.txt
│  └─ 화면설계서
│     ├─ 공지관리시스템_화면설계서.docx
│     ├─ 공지대시보드.png
│     ├─ 공지등록화면.png
│     ├─ 공지발송결재.png
│     ├─ 공지발송히스토리.png
│     └─ 프레젠테이션1.pptx
├─ 요구.txt
├─ 이슈발생사항
│  ├─ XSS보안이슈.txt
│  └─ 로그인자동.txt
└─ 테스트
   ├─ COMPLETE_TEST_GUIDE.html
   ├─ notice_system_test_guide.html
   └─ notice_system_test_guide.xlsx

```