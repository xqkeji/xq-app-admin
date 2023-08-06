<?php
namespace xqkeji\app\admin\composer;
use MongoDB\Driver\Manager;
use MongoDB\Driver\Command;
use MongoDB\Driver\BulkWrite;
use MongoDB\BSON\ObjectId;
class Install
{
    public static function getRootPath():string
    {
        return dirname(__DIR__,5);
    }
    public static function getRootConfigPath():string
    {
        return dirname(__DIR__,5).DIRECTORY_SEPARATOR.'config';
    }
    public static function postInstall() : void
    {
        $configPath=self::getRootConfigPath();
        $containerFile=$configPath.DIRECTORY_SEPARATOR.'container.php';

        if(is_file($containerFile))
        {
            $config=include($containerFile);
            if(isset($config['db']))
            {
                $db=$config['db'];
                $hostname=$db['hostname'] ?? '';
                $hostport=$db['hostport'] ?? '';
                $database=$db['database'] ?? '';
                $username=$db['username'] ?? '';
                $password=$db['password'] ?? '';
                if(!empty($username))
                {
                    $uri='mongodb://'.$username.':'.$password.'@'.$hostname.':'.$hostport;
                }
                else
                {
                    $uri='mongodb://'.$hostname.':'.$hostport;
                }
                $mustInsert=true;
                $manager = new Manager($uri,['serverSelectionTryOnce'=>false,'serverSelectionTimeoutMS'=>500,'connectTimeoutMS'=>500]);
                //创建索引
                $cmd = new Command([
                    // 集合名
                    'createIndexes' => 'admin_user',
                    'indexes' => [
                        [
                            // 索引名
                            'name' => 'admin_user_unique',
                            // 索引字段数组
                            'key' => [
                                'username' => 1
                            ],
                            'unique'=>true,
                        ],
                    ],
                ]);
                $result = $manager->executeCommand('xqkeji_db', $cmd)->toArray();
                if (!empty($result)) {
                    $ok = intval($result[0]->ok);
                    if($ok>0)
                    {
                        echo "创建管理员集合username字段唯一索引成功！\r\n";
                    }
                    else
                    {
                        echo "创建管理员集合username字段唯一索引失败！\r\n";
                    }
                }
                //

                $id = new ObjectId("58514b454a495f41444d494e");
                $filter = ['_id' => $id];
                $cmd = new Command([
                    'count' => 'admin_user', 
                    'query' => $filter 
                ]);
                $result=$manager->executeCommand($database, $cmd)->toArray();
                if (!empty($result)) {
                    $count = intval($result[0]->n);
                    if($count>0)
                    {
                        $mustInsert=false;
                    }
                }
                if($mustInsert)
                {
                    $bulk = new BulkWrite();
                    $user=[
                        '_id'=>$id,
                        'username'=>'xqkeji',
                        'password'=>'$2y$10$MDY2VHhrbEdrWGwxTmxtQOhPFb2CY4PX6ji26vedZ0.5dwIpFW3pm',
                        'fullname'=>'xqkeji.cn',
                        'email'=>'support@xqkeji.cn',
                        'status'=>1,
                        'is_root'=>1,
                        'login_time'=>0,
                        'login_counts'=>0,
                        'login_ip'=>'',
                        'reg_time'=>time(),
                        'reg_ip'=>'127.0.0.1',
                    ];
                    $bulk->insert($user);
                    $manager->executeBulkWrite($database.'.admin_user', $bulk); 
                    echo "创建默认管理员账号：xqkeji,密码：xqkeji,请第一次登录系统后修改密码！\r\n";
                }
                

            }
            else
            {
                throw new \Exception("the config file:\"$containerFile\" can not found 'db' config!" , 404);
            }
        }
        else
        {
            throw new \Exception("the config file:\"$containerFile\" not exists!" , 404);
        }
    }
    
}